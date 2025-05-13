import { ProgramOptionsType } from "../data.js";
import { IgnoreLike } from "glob";

export type OutConfigType = {
  out?: string;
};

export type DryConfigType = {
  dry?: boolean;
};
export type DebugConfigType = {
  debug?: boolean;
};
export type SrcConfigType = {
  src?: string;
};

export type IgnoreConfigType = {
  ignore?: string | string[] | IgnoreLike;
};

export type ConfigType = {
  config?: string;
};

export const configOption: ProgramOptionsType = {
  short: "c",
  name: "config",
  description: "Path to configuration file",
};

export const dryRunOption: ProgramOptionsType = {
  short: "d",
  name: "dry",
  description: "Do a dry run with this command - prints/returns output",
  defaultValue: false,
};

export const outOption: ProgramOptionsType = {
  short: "o",
  name: "out",
  description: "Relative path where the file should be written",
  defaultValue: ".",
};

export const srcOption: ProgramOptionsType = {
  short: "s",
  name: "src",
  description: "Source folder with all svgs",
  required: true,
  inquirer: {
    input: { message: "What is the source folder with all the svgs?" },
  },
};

export const ignoreOption: ProgramOptionsType = {
  short: "i",
  name: "ignore",
  description: "Glob or path like to exclude from files",
  array: true,
  defaultValue: [],
};

export const debugOption: ProgramOptionsType = {
  short: "g",
  name: "debug",
  description: "Extra logging",
  defaultValue: false,
};
