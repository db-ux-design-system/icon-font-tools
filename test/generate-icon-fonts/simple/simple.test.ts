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
    
    // Check that "all" folder is NOT created when using custom sizes
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(false);
  });

  test("withSizes generates all directory and default size splits", async () => {
    await generateIconFonts({
      fontName: "test-withsizes",
      src: "./test/generate-icon-fonts/simple",
      ignore: ["**/ignore/**", "**/tmp/**"],
      variants: [],
      withSizes: true,
    });

    const fontsDir = "./test/generate-icon-fonts/simple/fonts";

    // "all" folder should still be generated when using --withSizes (no custom sizes)
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/all/info.json`)).toBe(true);

    // Default directory should exist
    expect(fs.existsSync(`${fontsDir}/default`)).toBe(true);

    // At least some of the default availableSizes should produce directories
    const expectedSizes = [16, 20, 24, 32];
    for (const size of expectedSizes) {
      expect(fs.existsSync(`${fontsDir}/default_${size}`)).toBe(true);
    }
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
    
    // Verify "all" folder is not created when using custom sizes
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(false);
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
    
    // Verify "all" folder is not created when using custom sizes
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(false);
    for (const size of defaultSizes) {
      expect(fs.existsSync(`${fontsDir}/default_${size}`)).toBe(false);
    }
  });

  test("custom sizes work with size-only SVGs (no base file)", async () => {
    await generateIconFonts({
      fontName: "test-sizeonly",
      src: "./test/generate-icon-fonts/size-only",
      ignore: ["**/tmp/**", "**/fonts/**"],
      variants: [],
      sizes: [40],
    });

    const fontsDir = "./test/generate-icon-fonts/size-only/fonts";

    // The default directory should exist with generated font files
    expect(fs.existsSync(`${fontsDir}/default`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default/info.json`)).toBe(true);

    // The size-specific directory should also exist with generated font files
    expect(fs.existsSync(`${fontsDir}/default_40`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_40/info.json`)).toBe(true);

    // Verify the icon was correctly recognized (stripped _40 suffix)
    const infoJson = JSON.parse(
      fs.readFileSync(`${fontsDir}/default/info.json`).toString("utf-8"),
    );
    expect(infoJson).toHaveProperty("sizeonly");

    // No "all" folder when using custom sizes
    expect(fs.existsSync(`${fontsDir}/all`)).toBe(false);
  });

  test("size suffix stripping does not corrupt longer sizes (e.g. _128 vs _12)", async () => {
    await generateIconFonts({
      fontName: "test-suffix",
      src: "./test/generate-icon-fonts/size-suffix",
      ignore: ["**/tmp/**", "**/fonts/**"],
      variants: [],
      sizes: [12, 128],
    });

    const fontsDir = "./test/generate-icon-fonts/size-suffix/fonts";

    // Both size directories should exist
    expect(fs.existsSync(`${fontsDir}/default_12`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default_128`)).toBe(true);

    // The icon should be recognized as "diamond" (not "diamond8" from partial _12 stripping)
    const infoJson = JSON.parse(
      fs.readFileSync(`${fontsDir}/default/info.json`).toString("utf-8"),
    );
    expect(infoJson).toHaveProperty("diamond");
    expect(infoJson).not.toHaveProperty("diamond8");

    // Only one icon should be found (both files are the same icon at different sizes)
    expect(Object.keys(infoJson).length).toBe(1);
  });

  test("size suffix stripping handles size-only SVG with overlapping built-in size", async () => {
    await generateIconFonts({
      fontName: "test-overlap",
      src: "./test/generate-icon-fonts/size-suffix",
      ignore: ["**/tmp/**", "**/fonts/**"],
      variants: [],
      sizes: [128], // Only request 128, but source also has _12 which is a built-in size
    });

    const fontsDir = "./test/generate-icon-fonts/size-suffix/fonts";

    // Should generate the requested size directory
    expect(fs.existsSync(`${fontsDir}/default_128`)).toBe(true);

    // The icon should still be recognized as "diamond"
    const infoJson = JSON.parse(
      fs.readFileSync(`${fontsDir}/default/info.json`).toString("utf-8"),
    );
    expect(infoJson).toHaveProperty("diamond");
    expect(infoJson).not.toHaveProperty("diamond8");
  });

  test("custom sizes with source only having unrequested built-in size suffix", async () => {
    // Source has arrow_64.svg but user requests sizes: [16]
    // _64 is stripped (built-in size), so icon is "arrow"
    // initDefaultFile must find arrow_64.svg to create the default fallback
    await generateIconFonts({
      fontName: "test-mismatch",
      src: "./test/generate-icon-fonts/size-mismatch",
      ignore: ["**/tmp/**", "**/fonts/**"],
      variants: [],
      sizes: [16],
    });

    const fontsDir = "./test/generate-icon-fonts/size-mismatch/fonts";

    // Default directory should exist and the icon should be recognized as "arrow"
    expect(fs.existsSync(`${fontsDir}/default`)).toBe(true);
    expect(fs.existsSync(`${fontsDir}/default/info.json`)).toBe(true);

    const infoJson = JSON.parse(
      fs.readFileSync(`${fontsDir}/default/info.json`).toString("utf-8"),
    );
    expect(infoJson).toHaveProperty("arrow");

    // Requested size directory should also exist
    expect(fs.existsSync(`${fontsDir}/default_16`)).toBe(true);
  });
});
