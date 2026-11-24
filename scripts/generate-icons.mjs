import { readFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const master = await readFile("logo.png");
await mkdir("public/assets/brand", { recursive: true });
await mkdir("public/icons", { recursive: true });

await sharp(master)
  .resize(1024, 1024)
  .flatten({ background: "#f6f1dc" })
  .png()
  .toFile("public/assets/brand/icon.png");

const roundedMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect x="0" y="0" width="1024" height="1024" rx="224" ry="224" fill="#fff"/></svg>`,
);
await sharp(master)
  .resize(1024, 1024)
  .ensureAlpha()
  .composite([{ input: roundedMask, blend: "dest-in" }])
  .png()
  .toFile("public/assets/brand/icon-rounded.png");

for (const [file, size] of [
  ["apple-touch-icon.png", 180],
  ["icons/icon-192.png", 192],
  ["icons/icon-512.png", 512],
]) {
  await sharp(master)
    .resize(size, size)
    .flatten({ background: "#f6f1dc" })
    .png()
    .toFile(`public/${file}`);
}

const maskable = await sharp(master).resize(416, 416).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 3, background: "#f6f1dc" } })
  .composite([{ input: maskable, left: 48, top: 48 }])
  .png()
  .toFile("public/icons/maskable-512.png");

console.log(
  "Exported hero-derived logo, README rounded icon and PWA/Apple icons (preserving existing favicon).",
);
