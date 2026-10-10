import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const files = await readdir('dist', { recursive: true, withFileTypes: true });
const paths = files.filter(file => file.isFile() && file.name !== 'sw.js')
  .map(file => `${file.parentPath}/${file.name}`).sort();
const template = await readFile('scripts/service-worker.js', 'utf8');
const hash = createHash('sha256').update(template);
for (const path of paths) hash.update(path).update(await readFile(path));
const shell = paths.filter(path => !/dist\/(api|art|audio|voice-preview)\//.test(path) && !path.endsWith('/_headers'))
  .map(path => path.replace(/^dist/, '').replace('/index.html', '/'));
await writeFile('dist/sw.js', template.replace('__VERSION__', hash.digest('hex').slice(0, 16)).replace('__SHELL__', JSON.stringify(shell)));
console.log(`PWA 已生成：预缓存 ${shell.length} 个应用文件，不预下载插画或录音。`);
