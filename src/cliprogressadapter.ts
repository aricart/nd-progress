import type { Progress } from "./progress.ts";
import cliProgress from "cli-progress";

class CliProgressAdapter implements Progress {
  progress: InstanceType<typeof cliProgress.SingleBar>;
  current: number;
  max: number;
  running: boolean;

  constructor(max: number) {
    this.max = max;
    this.current = 0;
    this.running = false;
    this.createProgress();
  }

  log(s: string): Promise<void> {
    return this.message(`${new Date().toISOString()} ${s}`);
  }

  stop(): void {
    if (this.running) {
      this.progress.stop();
      this.running = false;
    }
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
    this.running = true;
  }

  message(s: string): Promise<void> {
    // temporarily stop the bar to print message, then resume
    if (this.running) {
      this.progress.stop();
      console.log(`\r${s}`);
      this.progress.start(this.max, this.current);
    } else {
      console.log(s);
    }
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
