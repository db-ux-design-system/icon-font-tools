/* eslint-disable no-await-in-loop */
import { log } from "node:console";
import { GifConfigType } from "./data.js";
import gatherIcons from "./utils/gather-icons.js";
import { debugLog } from "../../utils/index.js";
import svgToFont from "./utils/svg-to-font.js";
import { copyFileSync, existsSync, readdirSync, rmSync } from "node:fs";

export const generateIconFonts = async (
  values: GifConfigType,
): Promise<unknown> => {
  const { src, dry, debug = false, overwriteSources = false } = values;
  const dist = `${src}/fonts`;
  const temporaryDirectory = `${src}/tmp`;

  if (dry) {
    log("values:", values);
    return gatherIcons(temporaryDirectory, values);
  } else {
    if (existsSync(temporaryDirectory)) {
      rmSync(temporaryDirectory, { recursive: true });
    }

    if (existsSync(dist)) {
      rmSync(dist, { recursive: true });
    }

    debugLog(debug, "---Start gathering icon---");
    const iconPaths = gatherIcons(temporaryDirectory, values);

    debugLog(debug, "---Start svg to font ---");
    const allTemporaryDirectories = readdirSync(temporaryDirectory);
    const { sizes, withSizes } = values;
    const useSizes = sizes && sizes.length > 0 ? true : withSizes;
    
    for (const directory of allTemporaryDirectories) {
      // Skip the "all" directory when using size splitting - it's only for processing
      if (useSizes && directory === "all") {
        continue;
      }
      
      const subDist = `${dist}/${directory}`;
      const subTemporaryDir = `${temporaryDirectory}/${directory}`;
      debugLog(debug, `svgToFont for ${subTemporaryDir}`);
      await svgToFont(subTemporaryDir, subDist, values);
    }

    if (overwriteSources && iconPaths) {
      const tempAllDir = `${temporaryDirectory}/all`;
      iconPaths.forEach((svgPath) => {
        const paths = svgPath.split("/");
        const filename: string = paths.at(-1) || "";
        const tmpFile = `${tempAllDir}/${filename}`;
        if (existsSync(`${tempAllDir}/${filename}`)) {
          copyFileSync(tmpFile, svgPath);
        }
      });
    }

    if (!debug) {
      rmSync(temporaryDirectory, { recursive: true });
    }
  }

  return true;
};
