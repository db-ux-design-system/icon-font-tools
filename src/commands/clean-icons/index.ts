import { CleanIconsConfigType, cleanIconsOptions } from "./data";
import { startInquirerProcess } from "../../utils/inquirer-process";
import { GlobOptionsWithFileTypesFalse, globSync } from "glob";
import SVGFixer from "oslllo-svg-fixer";
import { error } from "console";
import { existsSync } from "node:fs";
import { mkdirSync } from "fs";

export const cleanIconAction = async (passedConfig: CleanIconsConfigType) => {
  const config = await startInquirerProcess<CleanIconsConfigType>(
    passedConfig,
    cleanIconsOptions,
  );

  const { src, ignoreGlobs, traceResolution, debug, dry, out } = config;

  const paths = `${src}/**/*.svg`;
  const options: GlobOptionsWithFileTypesFalse = {};
  if (ignoreGlobs) {
    options.ignore = ignoreGlobs;
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
