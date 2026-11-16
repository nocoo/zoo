import Foundation
import Network

final class LocalStaticServer: @unchecked Sendable {
    private let rootURL: URL
    private let queue = DispatchQueue(label: "ai.hexly.zoo.local-server", qos: .userInitiated)
    private var listener: NWListener?
    private(set) var port: UInt16 = 0

    init(rootURL: URL) {
        self.rootURL = rootURL.standardizedFileURL
    }

    func start() throws -> UInt16 {
        let parameters = NWParameters.tcp
        parameters.allowLocalEndpointReuse = true
        parameters.requiredLocalEndpoint = NWEndpoint.hostPort(host: .ipv4(.loopback), port: .any)

        let listener = try NWListener(using: parameters)
        let semaphore = DispatchSemaphore(value: 0)
        var startError: Error?

        listener.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                if let assignedPort = listener.port?.rawValue {
                    self?.port = assignedPort
                }
                semaphore.signal()
            case .failed(let error):
                startError = error
                semaphore.signal()
            default:
                break
            }
        }

        listener.newConnectionHandler = { [weak self] connection in
            self?.handle(connection: connection)
        }

        listener.start(queue: queue)
        semaphore.wait()

        if let error = startError {
            throw error
        }
        self.listener = listener
        return port
    }

    func stop() {
        listener?.cancel()
        listener = nil
    }

    private func handle(connection: NWConnection) {
        connection.start(queue: queue)
        receiveRequest(on: connection, buffer: Data())
    }

    private func receiveRequest(on connection: NWConnection, buffer: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, isComplete, error in
            guard let self else {
                connection.cancel()
                return
            }
            if error != nil {
                connection.cancel()
                return
            }

            var accumulated = buffer
            if let data {
                accumulated.append(data)
            }

            if let headerEnd = accumulated.range(of: Data("\r\n\r\n".utf8)) {
                let headerData = accumulated[..<headerEnd.upperBound]
                if let headerText = String(data: headerData, encoding: .utf8) {
                    self.respond(to: headerText, on: connection)
                    return
                }
                self.sendSimpleResponse(status: "400 Bad Request", on: connection)
                return
            }

            if isComplete || accumulated.count > 65536 {
                self.sendSimpleResponse(status: "400 Bad Request", on: connection)
                return
            }

            self.receiveRequest(on: connection, buffer: accumulated)
        }
    }

    private func respond(to requestText: String, on connection: NWConnection) {
        let lines = requestText.components(separatedBy: "\r\n")
        guard let requestLine = lines.first else {
            sendSimpleResponse(status: "400 Bad Request", on: connection)
            return
        }

        let parts = requestLine.split(separator: " ", omittingEmptySubsequences: true)
        guard parts.count >= 2 else {
            sendSimpleResponse(status: "400 Bad Request", on: connection)
            return
        }

        let method = String(parts[0]).uppercased()
        guard method == "GET" || method == "HEAD" else {
            sendSimpleResponse(status: "405 Method Not Allowed", on: connection)
            return
        }

        let rawTarget = String(parts[1])
        let pathOnly = rawTarget.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false).first.map(String.init) ?? "/"
        let decodedPath = pathOnly.removingPercentEncoding ?? pathOnly
        let relativePath = decodedPath == "/" ? "index.html" : String(decodedPath.drop(while: { $0 == "/" }))

        let targetURL = rootURL.appendingPathComponent(relativePath).standardizedFileURL
        let rootPath = rootURL.path.hasSuffix("/") ? rootURL.path : rootURL.path + "/"
        guard targetURL.path == rootURL.path || targetURL.path.hasPrefix(rootPath) else {
            sendSimpleResponse(status: "403 Forbidden", on: connection)
            return
        }

        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: targetURL.path, isDirectory: &isDirectory) else {
            sendSimpleResponse(status: "404 Not Found", on: connection)
            return
        }

        let fileURL = isDirectory.boolValue ? targetURL.appendingPathComponent("index.html") : targetURL
        guard let attributes = try? FileManager.default.attributesOfItem(atPath: fileURL.path),
              let fileSize = attributes[.size] as? Int64,
              let fileHandle = try? FileHandle(forReadingFrom: fileURL) else {
            sendSimpleResponse(status: "404 Not Found", on: connection)
            return
        }
        defer { try? fileHandle.close() }

        let mimeType = Self.mimeType(for: fileURL.pathExtension)
        let rangeHeader = lines.dropFirst().first { $0.lowercased().hasPrefix("range:") }

        if let rangeHeader, let byteRange = Self.parseRange(header: rangeHeader, fileSize: fileSize) {
            let length = Int(byteRange.upperBound - byteRange.lowerBound + 1)
            try? fileHandle.seek(toOffset: UInt64(byteRange.lowerBound))
            let body = method == "HEAD" ? Data() : (try? fileHandle.read(upToCount: length)) ?? Data()

            let headers = [
                "HTTP/1.1 206 Partial Content",
                "Content-Type: \(mimeType)",
                "Content-Length: \(length)",
                "Content-Range: bytes \(byteRange.lowerBound)-\(byteRange.upperBound)/\(fileSize)",
                "Accept-Ranges: bytes",
                "Cache-Control: no-store",
                "Connection: close",
                "",
                ""
            ].joined(separator: "\r\n")

            send(headers: headers, body: body, on: connection)
            return
        }

        let body = method == "HEAD" ? Data() : (try? fileHandle.readToEnd()) ?? Data()
        let headers = [
            "HTTP/1.1 200 OK",
            "Content-Type: \(mimeType)",
            "Content-Length: \(fileSize)",
            "Accept-Ranges: bytes",
            "Cache-Control: no-store",
            "Connection: close",
            "",
            ""
        ].joined(separator: "\r\n")

        send(headers: headers, body: body, on: connection)
    }

    private func send(headers: String, body: Data, on connection: NWConnection) {
        var payload = Data(headers.utf8)
        payload.append(body)
        connection.send(content: payload, completion: .contentProcessed { _ in
            connection.cancel()
        })
    }

    private func sendSimpleResponse(status: String, on connection: NWConnection) {
        let headers = [
            "HTTP/1.1 \(status)",
            "Content-Length: 0",
            "Connection: close",
            "",
            ""
        ].joined(separator: "\r\n")
        send(headers: headers, body: Data(), on: connection)
    }

    private static func parseRange(header: String, fileSize: Int64) -> ClosedRange<Int64>? {
        guard fileSize > 0 else { return nil }
        guard let value = header.split(separator: ":", maxSplits: 1).last?.trimmingCharacters(in: .whitespaces),
              value.lowercased().hasPrefix("bytes=") else {
            return nil
        }

        let spec = String(value.dropFirst(6)).split(separator: ",", maxSplits: 1).first.map(String.init) ?? ""
        let bounds = spec.split(separator: "-", maxSplits: 1, omittingEmptySubsequences: false).map(String.init)
        guard bounds.count == 2 else { return nil }

        if bounds[0].isEmpty, let suffix = Int64(bounds[1]), suffix > 0 {
            let start = max(0, fileSize - suffix)
            return start...(fileSize - 1)
        }

        guard let start = Int64(bounds[0]), start >= 0, start < fileSize else { return nil }
        let end = bounds[1].isEmpty ? (fileSize - 1) : min(fileSize - 1, Int64(bounds[1]) ?? (fileSize - 1))
        guard start <= end else { return nil }
        return start...end
    }

    private static func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "html": return "text/html; charset=utf-8"
        case "js", "mjs": return "application/javascript; charset=utf-8"
        case "css": return "text/css; charset=utf-8"
        case "json", "webmanifest": return "application/json; charset=utf-8"
        case "webp": return "image/webp"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "svg": return "image/svg+xml"
        case "woff2": return "font/woff2"
        case "mp3": return "audio/mpeg"
        case "ico": return "image/x-icon"
        default: return "application/octet-stream"
        }
    }
}
