import type { Progress } from "./progress.ts";

/**
 * Returns a Promise to a Progress.
 * @param max
 */
export async function progressFactory(max: number): Promise<Progress> {
  if (typeof globalThis.Deno !== "undefined") {
    const { newProgress } = await import("./progressbaradapter.ts");
    return newProgress(max);
  } else {
    const { newProgress } = await import("./cliprogressadapter.ts");
    return newProgress(max);
  }
}
