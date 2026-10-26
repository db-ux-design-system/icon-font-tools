import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { generateIconFonts } from "../../../src/commands/generate-icon-fonts/index";
import { normalizeSizes } from "../../../src/commands/generate-icon-fonts/utils/normalize-sizes";

const src = "./test/generate-icon-fonts/invalid-sizes";
const fontsDir = `${src}/fonts`;
const ignore = ["**/tmp/**", "**/fonts/**"];

describe("invalid sizes", () => {
  test("normalizeSizes keeps only positive integers", () => {
    expect(normalizeSizes(undefined)).toEqual([]);
    expect(normalizeSizes(true)).toEqual([]);
    expect(normalizeSizes(["16", 24, "16", 24])).toEqual([16, 24]);
    expect(
      normalizeSizes(["abc", "0", "-5", "16.5", "", 0, Number.NaN, "32"])
    ).toEqual([32]);
  });

  test("invalid values are ignored, valid ones are still generated", async () => {
    await generateIconFonts({
      fontName: "test-invalid-mixed",
      src,
      ignore,
      variants: [],
      // Simulates CLI input: --sizes abc 0 -5 16.5 16
      sizes: ["abc", "0", "-5", "16.5", "16"] as unknown as number[]
    });

    expect(fs.readdirSync(fontsDir).sort()).toEqual(["default", "default_16"]);
  });

  test("only invalid values behave like no custom sizes", async () => {
    await generateIconFonts({
      fontName: "test-invalid-only",
      src,
      ignore,
      variants: [],
      sizes: ["abc", "0"] as unknown as number[]
    });

    // No size splitting, and the "all" folder is generated as without `sizes`
    expect(fs.readdirSync(fontsDir).sort()).toEqual(["all", "default"]);
  });
});
