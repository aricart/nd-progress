import type { Progress } from "./progress.ts";
// @ts-ignore - deno-only dependency
import ProgressBar from "@deno-library/progress";

class ProgressBarAdapter implements Progress {
  progress: ProgressBar;

  constructor(total: number) {
    this.progress = new ProgressBar({
      total,
      complete: "=",
      incomplete: "-",
      prettyTime: true,
      display: ":completed/:total :time [:bar] :percent :eta :title",
    });
  }
  stop(): void {
    this.progress.end();
  }
  message(s: string): Promise<void> {
    return this.progress.console(s);
  }
  update(n: number): Promise<void> {
    return this.progress.render(n);
  }

  log(s: string): Promise<void> {
    return this.message(`${new Date().toISOString()} ${s}`);
  }
}

export function newProgress(n: number): Progress {
  return new ProgressBarAdapter(n);
}
