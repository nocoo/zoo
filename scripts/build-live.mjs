import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const { name, version } = JSON.parse(await readFile('package.json', 'utf8'));
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await mkdir('dist/api', { recursive: true });
await writeFile('dist/api/live', `${JSON.stringify({ status: 'ok', name, version, revision })}\n`);
console.log(`健康文件已生成：${name} ${version} (${revision.slice(0, 7)})。`);
