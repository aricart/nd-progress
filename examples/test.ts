import { progressFactory } from "../src/mod.ts";

const progress = await progressFactory(100);
let n = 0;
const timer = setInterval(async () => {
  await progress.update(++n);
  if (n % 23 === 0) {
    await progress.log(`hi ${n}`);
  }
  if (n % 42 === 0) {
    await progress.message(`hello ${n}`);
  }
  if (n === 100) {
    clearInterval(timer);
    progress.stop();
  }
}, 100);
