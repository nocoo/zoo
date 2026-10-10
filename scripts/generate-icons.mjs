import { readFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const foreground = await readFile('logo.png');
const tile = await readFile('public/assets/brand/icon.png');
await mkdir('public/icons', { recursive: true });
for (const [file, size] of [
  ['apple-touch-icon.png', 180],
  ['icons/icon-192.png', 192],
  ['icons/icon-512.png', 512],
]) {
  await sharp(tile).resize(size, size).flatten({ background: '#dce4d4' }).png().toFile(`public/${file}`);
}
const maskable = await sharp(foreground).resize(384, 384).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 3, background: '#dce4d4' } })
  .composite([{ input: maskable, left: 64, top: 64 }]).png().toFile('public/icons/maskable-512.png');
for (const size of [16, 24, 32, 48, 64, 80, 192]) {
  await sharp(foreground).resize(size, size).png().toFile(`public/icons/logo-${size}.png`);
}
await sharp(foreground).resize(64, 64).png().toFile('public/favicon.png');
console.log('Exported approved Zoo identity for browser, Apple and PWA roles.');
