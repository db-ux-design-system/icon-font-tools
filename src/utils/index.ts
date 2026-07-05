import { log } from "node:console";

export const debugLog = (debug: boolean | undefined, message: string) => {
  if (debug) {
    log(message);
  }
};
