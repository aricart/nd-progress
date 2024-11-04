import { Progress } from "./progress.ts";
import cliProgress from "cli-progress";

class CliProgressAdapter implements Progress {
  progress: typeof cliProgress.SingleBar;
  current: number;
  max: number;

  constructor(max: number) {
    this.max = max;
    this.current = 0;
    this.createProgress();
  }

  log(s: string): Promise<void> {
    return this.message(`${new Date().toISOString()} ${s}`);
  }

  stop(): void {
    this.progress.stop();
  }

  createProgress(): void {
    this.progress = new cliProgress.SingleBar({
      format:
        "{value}/{total} {duration_formatted} [{bar}] {percentage}% {eta_formatted}",
      barCompleteChar: "=",
      barIncompleteChar: "-",
      hideCursor: true,
    }, cliProgress.Presets.legacy);
    this.progress.start(this.max, this.current);
  }

  message(s: string): Promise<void> {
    this.stop();
    console.log(`\r${s}`);
    this.createProgress();
    return Promise.resolve();
  }
  update(n: number): Promise<void> {
    this.progress.update(n);
    this.current = n;
    return Promise.resolve();
  }
}

export function newProgress(n: number): Progress {
  return new CliProgressAdapter(n);
}
