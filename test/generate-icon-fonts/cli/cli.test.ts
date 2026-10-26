import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { getProgram } from "../../../src/program";

const src = "./test/generate-icon-fonts/cli";
const fontsDir = `${src}/fonts`;

describe("cli", () => {
  test("--sizes passed as CLI strings are handled like numbers", async () => {
    // Commander passes variadic values as strings (["16"]). Mixed with the
    // numeric built-in sizes, "16" was stripped twice from repeat_16_16.svg,
    // which resulted in the unknown icon "repeat" and an ENOENT crash.
    await getProgram("icon-font-tools", "test").parseAsync([
      "node",
      "icon-font-tools",
      "generate-icon-fonts",
      "--src",
      src,
      "--fontName",
      "test-cli",
      "--ignore",
      "**/tmp/**",
      "**/fonts/**",
      "--sizes",
      "16"
    ]);

    expect(fs.readdirSync(fontsDir).sort()).toEqual(["default", "default_16"]);

    const infoJson = JSON.parse(
      fs.readFileSync(`${fontsDir}/default_16/info.json`).toString("utf-8")
    );
    expect(Object.keys(infoJson)).toEqual(["repeat_16"]);
  });
});
