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
    
    // Check that ALL default availableSizes [12, 14, 16, 20, 24, 28, 32, 48, 64] were NOT created
    // (except 16, 24, 32 which we explicitly requested)
    const defaultSizes = [12, 14, 16, 20, 24, 28, 32, 48, 64];
    const requestedSizes = [16, 24, 32];
    const unexpectedSizes = defaultSizes.filter(size => !requestedSizes.includes(size));
    
    for (const size of unexpectedSizes) {
      expect(fs.existsSync(`${fontsDir}/default_${size}`)).toBe(false);
    }
    
    // Check that the base default directory still exists
    expect(fs.existsSync(`${fontsDir}/default`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(true);
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
    
    // Should create size-specific directories even without withSizes being set
    expect(fs.existsSync(`${fontsDir}/default_20`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_40`)).toBe(true);
    
    // Verify that only the requested sizes were created (not default availableSizes)
    const allDirs = fs.readdirSync(fontsDir);
    const sizeSpecificDirs = allDirs.filter(dir => dir.startsWith("default_"));
    
    // Should have exactly 2 size-specific directories: default_20 and default_40
    expect(sizeSpecificDirs).toEqual(expect.arrayContaining(["default_20", "default_40"]));
    expect(sizeSpecificDirs.length).toBe(2);
  });

  test("sizes parameter produces only requested sizes", async () => {
    await generateIconFonts({
      fontName: "test-exact-sizes",
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**"],
      variants: [],
      sizes: [8, 128], // Non-standard sizes not in availableSizes
    });

    const fontsDir = "./test/generate-icon-fonts/simple/fonts";
    
    // Should create only the exact sizes requested
    expect(fs.existsSync(`${fontsDir}/default_8`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_128`)).toBe(true);
    
    // Read all directories and filter size-specific ones
    const allDirs = fs.readdirSync(fontsDir);
    const sizeSpecificDirs = allDirs.filter(dir => dir.startsWith("default_"));
    
    // Should have exactly 2 size directories
    expect(sizeSpecificDirs.sort()).toEqual(["default_128", "default_8"]);
    
    // Verify no default availableSizes [12, 14, 16, 20, 24, 28, 32, 48, 64] were created
    const defaultSizes = [12, 14, 16, 20, 24, 28, 32, 48, 64];
    for (const size of defaultSizes) {
      expect(fs.existsSync(`${fontsDir}/default_${size}`)).toBe(false);
    }
  });
});
