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
});
