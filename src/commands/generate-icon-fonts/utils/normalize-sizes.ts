import { warn } from "node:console";

/**
 * Normalizes the `sizes` option to a deduplicated list of positive integers.
 *
 * The CLI (Commander) passes variadic values as strings (e.g. `["16", "24"]`),
 * the JS API passes numbers, and `--sizes` without any value results in `true`.
 * Mixing strings and numbers breaks the size suffix stripping, so every caller
 * has to work with the normalized result only.
 */
export const normalizeSizes = (sizes: unknown): number[] => {
  if (sizes === undefined) {
    return [];
  }

  if (!Array.isArray(sizes)) {
    warn(
      "Ignoring `sizes`: please provide at least one size (e.g. --sizes 16 24 32)."
    );
    return [];
  }

  const normalized: number[] = [];
  const invalid: unknown[] = [];

  for (const size of sizes) {
    // Empty strings become 0 and are rejected by the `> 0` check
    const number = typeof size === "string" ? Number(size) : size;

    if (typeof number === "number" && Number.isInteger(number) && number > 0) {
      if (!normalized.includes(number)) {
        normalized.push(number);
      }
    } else {
      invalid.push(size);
    }
  }

  if (invalid.length > 0) {
    warn(
      `Ignoring invalid sizes: ${invalid.map((size) => (typeof size === "string" ? JSON.stringify(size) : String(size))).join(", ")}. Sizes must be positive integers.`
    );
  }

  return normalized;
};
