import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { pictures } from "../src/content.ts";
import { getTrackedPublicFiles, verifyArtMaps } from "./media-utils.ts";

if (process.env.ZOO_SKIP_MEDIA_BYTES === "1") {
  const trackedPublicFiles = getTrackedPublicFiles();
  for (const picture of pictures) {
    for (const path of [picture.image, picture.imageLarge]) {
      assert.ok(trackedPublicFiles.has(`public${path}`), `Missing tracked ${path}`);
    }
  }
  const media = JSON.parse(readFileSync("src/media.json", "utf8"));
  await verifyArtMaps(media.images);
  console.log("检查通过：扩展/新增/基础插画清单与 Git 追踪路径一致（跳过磁盘重哈希校验）。");
} else {
  const repository = fileURLToPath(new URL("../", import.meta.url));
  const root = await mkdtemp(join(tmpdir(), "zoo-expansion-media-"));
  const build = () =>
    spawnSync(process.execPath, [join(repository, "scripts/build-media.mjs")], {
      cwd: root,
      encoding: "utf8",
    });
  const outputs = ["src/media.json"];
  try {
    await mkdir(join(root, "src"));
    for (const map of [
      "src/expansion-art.json",
      "src/additions-art.json",
      "src/foundations-art.json",
    ]) {
      await copyFile(join(repository, map), join(root, map));
    }
    for (const path of pictures.flatMap((picture) => [picture.image, picture.imageLarge])) {
      const destination = join(root, `public${path}`);
      await mkdir(dirname(destination), { recursive: true });
      await symlink(join(repository, `public${path}`), destination);
    }
    for (const path of ["design", "public/audio", "public/audio-edge"]) {
      await symlink(join(repository, path), join(root, path), "dir");
    }
    const valid = build();
    assert.equal(valid.status, 0, valid.stderr);
    const before = await Promise.all(outputs.map((path) => readFile(join(root, path))));
    const first = pictures.find((picture) => picture.id === "transport-01");
    const second = pictures.find((picture) => picture.id === "transport-02");
    for (const field of ["image", "imageLarge"]) {
      for (const [destination, source] of [
        [first[field], second[field]],
        [second[field], first[field]],
      ]) {
        await unlink(join(root, `public${destination}`));
        await symlink(join(repository, `public${source}`), join(root, `public${destination}`));
      }
      const swapped = build();
      assert.notEqual(swapped.status, 0);
      assert.ok(
        swapped.stderr.includes(`Illustration differs: ${first.id}/${field}`),
        swapped.stderr,
      );
      for (const [index, path] of outputs.entries())
        assert.deepEqual(await readFile(join(root, path)), before[index]);
      for (const picture of [first, second]) {
        await unlink(join(root, `public${picture[field]}`));
        await symlink(
          join(repository, `public${picture[field]}`),
          join(root, `public${picture[field]}`),
        );
      }
    }
    for (const path of outputs) await unlink(join(root, path));
    await unlink(join(root, `public${first.image}`));
    await symlink(join(repository, `public${second.image}`), join(root, `public${first.image}`));
    const missingOutput = build();
    assert.notEqual(missingOutput.status, 0);
    assert.ok(
      missingOutput.stderr.includes(`Illustration differs: ${first.id}/image`),
      missingOutput.stderr,
    );
    for (const path of outputs) assert.ok(!existsSync(join(root, path)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
  console.log("检查通过：扩展插画构建校验拒绝交换缩略图/高清图，失败不改写或创建媒体清单。");
}
