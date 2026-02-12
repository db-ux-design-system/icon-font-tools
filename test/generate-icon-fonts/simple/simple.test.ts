import { describe, expect, test } from "vitest";
import fs from "node:fs";
import { generateIconFonts } from "../../../src/commands/generate-icon-fonts/index";

describe("simple", () => {
  test("check if glob works", async () => {
    const paths = await generateIconFonts({
      fontName: "test",
      dry: true,
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**", "**/fonts/**"],
      variants: ["test"],
    });
    expect(paths).toHaveLength(1);
  });

  test("check if fonts created", async () => {
    await generateIconFonts({
      fontName: "test",
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**"],
      variants: [],
    });

    const infoJson = JSON.parse(
      fs
        .readFileSync("./test/generate-icon-fonts/simple/fonts/all/info.json")
        .toString("utf-8"),
    );
    expect(infoJson.brand.unicode).toBe(
      "&#98;&amp;#114;&amp;#97;&amp;#110;&amp;#100;",
    );
  });

  test("check if custom sizes are used", async () => {
    await generateIconFonts({
      fontName: "test-sizes",
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**"],
      variants: [],
      sizes: [16, 24, 32],
    });

    const fontsDir = "./test/generate-icon-fonts/simple/fonts";
    
    // Check that custom size directories were created
    expect(fs.existsSync(`${fontsDir}/default_16`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_24`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_32`)).toBe(true);
    
    // Check that default sizes were NOT created
    expect(fs.existsSync(`${fontsDir}/default_12`)).toBe(false);
    expect(fs.existsSync(`${fontsDir}/default_20`)).toBe(false);
    expect(fs.existsSync(`${fontsDir}/default_48`)).toBe(false);
    
    // Check that the base default directory still exists
    expect(fs.existsSync(`${fontsDir}/default`)).toBe(true);
  });

  test("check if sizes implicitly sets withSizes", async () => {
    await generateIconFonts({
      fontName: "test-implicit",
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**"],
      variants: [],
      sizes: [20, 40],
      // Note: not setting withSizes explicitly
    });

    const fontsDir = "./test/generate-icon-fonts/simple/fonts";
    
    // Should create size-specific directories even without withSizes
    expect(fs.existsSync(`${fontsDir}/default_20`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_40`)).toBe(true);
  });
});
