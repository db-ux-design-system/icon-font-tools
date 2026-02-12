import { ProgramOptionsType } from "../../data.js";
import {
  configOption,
  ConfigType,
  DebugConfigType,
  debugOption,
  DryConfigType,
  dryRunOption,
  IgnoreConfigType,
  ignoreOption,
  SrcConfigType,
  srcOption,
} from "../../utils/shared.js";
import { Config } from "svgo";
import { SVGIcons2SVGFontStreamOptions } from "svgicons2svgfont";

export type GifConfigType = {
  fontName?: string;
  variants?: string[];
  overwriteSources?: boolean;
  prefix?: string;
  withSizes?: boolean;
  /**
   * Custom sizes for font splitting. If provided, implicitly sets withSizes to true.
   */
  sizes?: number[];
  /**
   * https://github.com/svg/svgo#configuration
   */
  svgoOptions?: Config;
  /**
   * Creates svg react components
   */
  outSVGReact?: boolean;

  /**
   * This is the setting for [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont/tree/dd713bea4f97afa59f7dba6a21ff7f22db565bcf#api)
   */
  svgicons2svgfont?: SVGIcons2SVGFontStreamOptions;
} & DryConfigType &
  SrcConfigType &
  IgnoreConfigType &
  DebugConfigType &
  ConfigType;

export const gifOptions: ProgramOptionsType[] = [
  {
    short: "v",
    name: "variants",
    description:
      'Font variants e.g. solid, inverted, etc. We always add a "default" variant for icons.',
    array: true,
    defaultValue: [],
  },
  {
    short: "w",
    name: "withSizes",
    description: "Splits the font into different sizes",
    required: false,
  },
  {
    short: "z",
    name: "sizes",
    description: "Custom sizes for font splitting. Use space-separated values (e.g., --sizes 16 24 32). Implicitly sets withSizes to true.",
    array: true,
    required: false,
  },
  {
    short: "p",
    name: "prefix",
    description: "Prefix of icons to delete for icons",
  },
  {
    short: "f",
    name: "fontName",
    description: "The name of your font",
    required: true,
    inquirer: {
      input: { message: "What is the name of your font?" },
    },
  },
  {
    name: "overwriteSources",
    short: "o",
    description: "Overwrite all svgs inside src directory",
    defaultValue: false,
  },
  // TODO: This is buggy we should fix it by making a PR to https://github.com/jaywcjlove/svgtofont
  /*  {
      name: "outSVGReact",
      description: "Creates react svg components",
      short: "react",
      defaultValue: false,
    },*/
  dryRunOption,
  srcOption,
  ignoreOption,
  debugOption,
  configOption,
];
