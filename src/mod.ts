import type { Progress } from "./progress.ts";

/**
 * Returns a Promise to a Progress.
 * @param max - the maximum value for the progress bar
 * @throws {Error} if max is not a positive number
 */
export async function progressFactory(max: number): Promise<Progress> {
  if (max <= 0 || !Number.isFinite(max)) {
    throw new Error("max must be a positive finite number");
  }

  if (typeof globalThis.Deno !== "undefined") {
    const { newProgress } = await import("./progressbaradapter.ts");
    return newProgress(max);
  } else if (
    typeof (globalThis as { process?: unknown }).process !== "undefined"
  ) {
    const { newProgress } = await import("./cliprogressadapter.ts");
    return newProgress(max);
  } else {
    throw new Error(
      "unsupported runtime: this library requires either Deno or Node.js",
    );
  }
}
