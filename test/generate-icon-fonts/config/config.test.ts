import { describe, expect, test } from "vitest";
import fs from "node:fs";
import { gifAction } from "../../../src/commands/generate-icon-fonts/action.js";

describe("config", () => {
  test("check if glob works", async () => {
    await gifAction({
      config: "test/generate-icon-fonts/config/generate-icon-fonts.json",
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
