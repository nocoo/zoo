import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { additionCategories } from "../src/additions.ts";
import { pictures } from "../src/content.ts";
import { expansionCategories } from "../src/expansion.ts";
import { foundationCategories } from "../src/foundations.ts";

const ART_MAPS = [
  ["src/expansion-art.json", expansionCategories],
  ["src/additions-art.json", additionCategories],
  ["src/foundations-art.json", foundationCategories],
] as const;

export function getTrackedPublicFiles(): Set<string> {
  const output = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "public"], {
    encoding: "utf8",
  });
  return new Set(output.split("\n").filter(Boolean));
}

export async function verifyArtMaps(images: Record<string, string>): Promise<void> {
  for (const [map, groups] of ART_MAPS) {
    const approved = JSON.parse(await readFile(map, "utf8")).images as Record<
      string,
      Record<"image" | "imageLarge", string> | undefined
    >;
    for (const card of groups.flatMap((category) => category.cards)) {
      const picture = pictures.find((item) => item.id === card.id);
      if (!picture) throw new Error(`Missing picture: ${card.id}`);
      for (const field of ["image", "imageLarge"] as const) {
        const key = picture[field];
        if (!key || images[key] !== approved[card.id]?.[field]) {
          throw new Error(`Illustration differs: ${card.id}/${field} (${map})`);
        }
      }
    }
  }
}
