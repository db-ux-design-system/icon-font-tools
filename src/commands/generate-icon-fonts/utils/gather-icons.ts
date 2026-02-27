import { globSync } from "glob";
import { log } from "node:console";
import { GifConfigType } from "../data.js";
import { debugLog } from "../../../utils/index.js";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const generalPrefix = "";

const availableSizes = [12, 14, 16, 20, 24, 28, 32, 48, 64];
const componentSizes = [32, 24, 20];

const allTemporaryDir = "all";

const initTemporaryIconFiles = (
  globPaths: string[],
  temporaryDirectory: string,
  sizesToStrip: number[],
  prefix?: string,
) => {
  const foundIconFiles: string[] = [];

  for (const svgPath of globPaths) {
    const paths = svgPath.split("/");
    let filename: string = paths.at(-1) || "";
    let iconName;
    if (prefix) {
      filename = filename.replace(prefix, "");
    }

    iconName = filename.replace(".svg", "");
    for (const size of sizesToStrip) {
      iconName = iconName.replace(`_${size}`, "");
    }

    copyFileSync(
      svgPath,
      `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${filename}`,
    );

    if (iconName && !foundIconFiles.includes(iconName)) {
      foundIconFiles.push(iconName);
    }
  }

  return foundIconFiles;
};

const getVariantFileName = (iconFileName: string, variant: string) =>
  variant === "" ? iconFileName : `${iconFileName}_${variant}`;

const initDefaultFile = (
  temporaryDirectory: string,
  iconFileName: string,
  variant: string,
) => {
  const fileName = getVariantFileName(iconFileName, variant);
  const defaultFileExists = existsSync(
    `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}.svg`,
  );

  if (!defaultFileExists) {
    for (const size of componentSizes) {
      const sizeFileName = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}_${size}.svg`;
      const altSizeFileName = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${iconFileName}_${size}_${variant}.svg`;

      for (const name of [sizeFileName, altSizeFileName]) {
        if (existsSync(name)) {
          copyFileSync(
            name,
            `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}.svg`,
          );

          return;
        }
      }
    }
  }
};

const createFallbackComponentSize = (
  temporaryDirectory: string,
  iconFileName: string,
  variant: string,
  fileName: string,
  path: string,
  size: number,
  alt: boolean,
): boolean => {
  const nextBestSizeArray =
    size === 20 ? [24, 32] : size === 24 ? [20, 32] : [24, 20];
  for (const nextSize of nextBestSizeArray) {
    const nextSizeFilePath = alt
      ? `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${iconFileName}_${nextSize}_${variant}.svg`
      : `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}_${nextSize}.svg`;
    if (existsSync(nextSizeFilePath)) {
      copyFileSync(nextSizeFilePath, path);
      return true;
    }
  }
  return false;
};

const initComponentSizes = (
  temporaryDirectory: string,
  iconFileName: string,
  variant: string,
) => {
  const fileName = getVariantFileName(iconFileName, variant);
  for (const size of componentSizes) {
    // Generate all component sizes inside /all directory
    const requiredFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}_${size}.svg`;
    const altRequiredFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${iconFileName}_${size}_${variant}.svg`;

    if (!existsSync(requiredFilePath)) {
      const created = createFallbackComponentSize(
        temporaryDirectory,
        iconFileName,
        variant,
        fileName,
        requiredFilePath,
        size,
        false,
      );
      if (!created) {
        createFallbackComponentSize(
          temporaryDirectory,
          iconFileName,
          variant,
          fileName,
          altRequiredFilePath,
          size,
          true,
        );
      }
    }
  }
};

const gatherIcons = (
  temporaryDirectory: string,
  values: GifConfigType,
): string[] | undefined => {
  const { src, ignore, prefix, dry, variants, withSizes, sizes, debug } = values;
  const paths = `${src}/**/*.svg`;

  // If custom sizes are provided, use them and implicitly enable withSizes
  const useSizes = sizes && sizes.length > 0 ? true : withSizes;
  const sizesToUse = sizes && sizes.length > 0 ? sizes : availableSizes;
  
  // We use this to generate all combinations of variants and sizes as fonts
  const splitSizesArray = useSizes ? ["", ...sizesToUse] : [""];
  const splitVariantsArray =
    variants && variants.length > 0 ? ["", ...variants] : [""];

  const globPaths = globSync(paths, { ignore }).map((path) =>
    path.replace(/\\/g, "/"),
  );

  if (dry) {
    log("files:", globPaths);
    return globPaths;
  }

  if (!existsSync(temporaryDirectory)) {
    mkdirSync(temporaryDirectory, { recursive: true });
  }

  if (!existsSync(`${temporaryDirectory}/${allTemporaryDir}`)) {
    mkdirSync(`${temporaryDirectory}/${allTemporaryDir}`, {
      recursive: true,
    });
  }

  const foundIconFiles = initTemporaryIconFiles(
    globPaths,
    temporaryDirectory,
    sizesToUse,
    prefix,
  );

  debugLog(debug, `Found ${foundIconFiles.length} icons`);

  for (const variant of splitVariantsArray) {
    for (const iconFileName of foundIconFiles.filter(
      (fileName) =>
        variants && !variants.some((va) => fileName.includes(`_${va}`)),
    )) {
      const fileName = getVariantFileName(iconFileName, variant);
      initDefaultFile(temporaryDirectory, iconFileName, variant);
      initComponentSizes(temporaryDirectory, iconFileName, variant);

      for (const size of splitSizesArray) {
        // Generate new directories based on size and variant
        const sizeFileEnding = `${size === "" ? "" : `_${size}`}`;
        const directory = `${
          variant === "" ? "default" : variant
        }${sizeFileEnding}`;
        const defaultFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}.svg`;
        const sizeFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${fileName}${sizeFileEnding}.svg`;
        const fallbackFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${iconFileName}.svg`;
        const fallbackSizeFilePath = `${temporaryDirectory}/${allTemporaryDir}/${generalPrefix}${iconFileName}${sizeFileEnding}.svg`;

        const newFileName = `${temporaryDirectory}/${directory}/${generalPrefix}${iconFileName}.svg`;

        if (!existsSync(`${temporaryDirectory}/${directory}`)) {
          mkdirSync(`${temporaryDirectory}/${directory}`, {
            recursive: true,
          });
        }

        if (existsSync(sizeFilePath)) {
          copyFileSync(sizeFilePath, newFileName);
        } else if (existsSync(defaultFilePath)) {
          copyFileSync(defaultFilePath, newFileName);
        } else if (existsSync(fallbackSizeFilePath)) {
          copyFileSync(fallbackSizeFilePath, newFileName);
        } else {
          copyFileSync(fallbackFilePath, newFileName);
        }
      }
    }
  }

  return globPaths;
};

export default gatherIcons;
