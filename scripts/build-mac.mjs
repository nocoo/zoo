import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const outDir = path.join(rootDir, "dist-mac");
const appName = "小小动物岛";
const executableName = "Zoo";
const bundleDir = path.join(outDir, `${appName}.app`);
const contentsDir = path.join(bundleDir, "Contents");
const macOsDir = path.join(contentsDir, "MacOS");
const resourcesDir = path.join(contentsDir, "Resources");
const targetDistDir = path.join(resourcesDir, "dist");

if (!fs.existsSync(path.join(distDir, "index.html"))) {
  console.error("未找到 dist/index.html，请先运行 npm run build。");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
const version = pkg.version || "1.0.0";

fs.rmSync(bundleDir, { recursive: true, force: true });
fs.mkdirSync(macOsDir, { recursive: true });
fs.mkdirSync(resourcesDir, { recursive: true });

function buildIcns(sourcePngPath, outputIcnsPath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "zoo-icon-"));
  const iconsetDir = path.join(tmpDir, "AppIcon.iconset");
  fs.mkdirSync(iconsetDir, { recursive: true });

  const sizes = [
    ["icon_16x16.png", 16],
    ["icon_16x16@2x.png", 32],
    ["icon_32x32.png", 32],
    ["icon_32x32@2x.png", 64],
    ["icon_128x128.png", 128],
    ["icon_128x128@2x.png", 256],
    ["icon_256x256.png", 256],
    ["icon_256x256@2x.png", 512],
    ["icon_512x512.png", 512],
    ["icon_512x512@2x.png", 1024],
  ];

  try {
    for (const [filename, size] of sizes) {
      execFileSync(
        "sips",
        ["-z", String(size), String(size), sourcePngPath, "--out", path.join(iconsetDir, filename)],
        { stdio: "ignore" },
      );
    }
    execFileSync("iconutil", ["-c", "icns", iconsetDir, "-o", outputIcnsPath], {
      stdio: "inherit",
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const iconSource = path.join(rootDir, "public", "assets", "brand", "icon.png");
if (fs.existsSync(iconSource)) {
  buildIcns(iconSource, path.join(resourcesDir, "AppIcon.icns"));
}

execFileSync(
  "swiftc",
  [
    "-O",
    "-parse-as-library",
    path.join(rootDir, "macos", "App.swift"),
    path.join(rootDir, "macos", "LocalServer.swift"),
    "-o",
    path.join(macOsDir, executableName),
    "-framework",
    "Cocoa",
    "-framework",
    "WebKit",
    "-framework",
    "Network",
  ],
  { stdio: "inherit" },
);

const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>zh_CN</string>
  <key>CFBundleDisplayName</key>
  <string>${appName}</string>
  <key>CFBundleExecutable</key>
  <string>${executableName}</string>
  <key>CFBundleIconFile</key>
  <string>AppIcon</string>
  <key>CFBundleIdentifier</key>
  <string>ai.hexly.zoo</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>${appName}</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>${version}</string>
  <key>CFBundleVersion</key>
  <string>${version}</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsLocalNetworking</key>
    <true/>
  </dict>
</dict>
</plist>
`;

fs.writeFileSync(path.join(contentsDir, "Info.plist"), infoPlist, "utf8");

fs.cpSync(distDir, targetDistDir, {
  recursive: true,
  filter: (src) => path.basename(src) !== "sw.js",
});

execFileSync("codesign", ["--force", "--deep", "--sign", "-", bundleDir], { stdio: "inherit" });

console.log(`macOS 应用已生成：${bundleDir}`);
