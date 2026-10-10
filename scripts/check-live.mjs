import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const expected = JSON.parse(await readFile('dist/api/live', 'utf8'));
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
assert.equal(expected.status, 'ok');
assert.equal(expected.version, version);
assert.match(expected.revision, /^[a-f0-9]{40}$/);
const directory = await mkdtemp(join(tmpdir(), 'zoo-live-'));
await writeFile(join(directory, 'wrangler.json'), JSON.stringify({
  name: 'zoo-local-test', compatibility_date: '2026-10-08',
  assets: { directory: resolve('dist'), not_found_handling: 'single-page-application' },
}));
const server = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev', '--config', join(directory, 'wrangler.json'), '--local', '--ip', '127.0.0.1', '--port', '0', '--inspector-port', '0', '--persist-to', join(directory, 'state')], {
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }, stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
try {
  const deadline = Date.now() + 30_000;
  while (!output.includes('Ready on')) {
    assert.equal(server.exitCode, null, output);
    assert.ok(Date.now() < deadline, `Local Worker did not start: ${output}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const origin = output.match(/Ready on (http:\/\/127\.0\.0\.1:\d+)/)[1];
  const response = await fetch(`${origin}/api/live`, { redirect: 'error', signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), expected);
  const head = await fetch(`${origin}/api/live`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('cache-control'), 'no-store');
  assert.equal(await head.text(), '');
  console.log('本地 Worker 健康检查通过：GET/HEAD、JSON、版本、源码修订和禁止缓存。测试使用已安装 workerd 支持的 2026-10-08；生产保留 2026-10-09，须另验。');
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
  await rm(directory, { recursive: true, force: true });
}
