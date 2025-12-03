import { CleanIconsConfigType } from "./data.js";
import { GlobOptionsWithFileTypesFalse, globSync } from "glob";
import SVGFixer from "oslllo-svg-fixer";
import { error } from "node:console";
import { existsSync } from "node:fs";
import { mkdirSync } from "node:fs";

export const cleanIcons = async (config: CleanIconsConfigType) => {
  const { src, ignore, traceResolution, debug, dry, out } = config;

  const paths = `${src}/**/*.svg`;
  const options: GlobOptionsWithFileTypesFalse = {};
  if (ignore) {
    options.ignore = ignore;
  }

  const globPaths = globSync(paths, options)
    .map((path) => path.replace(/\\/g, "/"))
    .map((path) => path.slice(0, Math.max(0, path.lastIndexOf("/"))))
    .filter((v, i, self) => i === self.indexOf(v));

  if (dry) {
    console.log(globPaths);
    return globPaths;
  }

  if (out && !existsSync(out)) {
    mkdirSync(out, { recursive: true });
  }

  const promises: Promise<unknown>[] = globPaths.map(async (path) => {
    try {
      // eslint-disable-next-line no-await-in-loop,new-cap
      return await SVGFixer(path, out ?? path, {
        showProgressBar: debug,
        traceResolution: Number(traceResolution || "600"),
      }).fix();
    } catch (catchError) {
      error(path, catchError);
      return catchError;
    }
  });

  return await Promise.all(promises);
};
