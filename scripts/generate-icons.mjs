import { readFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const original = await readFile('public/favicon.svg', 'utf8');
const drawing = original.replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/<rect[^>]*\/>/, '');
await mkdir('public/icons', { recursive: true });
for (const [file, size, inset] of [
  ['apple-touch-icon.png', 180, 7],
  ['icons/icon-192.png', 192, 7],
  ['icons/icon-512.png', 512, 7],
  ['icons/maskable-512.png', 512, 12],
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" fill="#fae7b3"/><g transform="translate(${inset} ${inset}) scale(${(64 - 2 * inset) / 64})">${drawing}</g></svg>`;
  await sharp(Buffer.from(svg)).flatten({ background: '#fae7b3' }).png().toFile(`public/${file}`);
}
console.log('已从现有小熊图标导出 Apple Touch Icon 和 PWA 图标。');
