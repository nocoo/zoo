import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';

const [origin, expected] = process.argv.slice(2);
assert.ok(origin && /^[a-f0-9]{40}$/.test(expected), 'Usage: node scripts/verify-deployment.mjs <origin> <commit-sha>');
for (let attempt = 0; ; attempt++) {
  try {
    const response = await fetch(`${origin}/api/live?t=${Date.now()}`, { signal: AbortSignal.timeout(15000) });
    assert.ok(response.ok);
    assert.match(response.headers.get('content-type'), /^application\/json/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const live = await response.json();
    assert.equal(live.status, 'ok');
    assert.equal(live.revision, expected);
    break;
  } catch (error) {
    if (attempt === 11) throw error;
    await setTimeout(10000);
  }
}
for (const path of ['/index.html', '/manifest.webmanifest', '/apple-touch-icon.png', '/sw.js', '/art/hd/animals-01-full.webp']) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30000) });
  assert.ok(response.ok, `${path}: ${response.status}`);
  const remote = Buffer.from(await response.arrayBuffer());
  const local = await readFile(`dist${path}`);
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(remote), hash(local), `Production bytes differ: ${path}`);
}
console.log(`线上提交与关键资源校验通过：${expected}`);
