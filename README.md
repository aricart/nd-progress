# nd-progress

A trivial progress bar wrapper for
["jsr:@deno-library/progress"](https://github.com/deno-library/progress) and
["npm:cli-progress"](https://github.com/npkgz/cli-progress) that runs in Deno or
Node.js with the same API. Note that configuration of the progress bars is very
limited, as the intention is to provide cross-runtime support for a progress
bar.

```typescript
import { getProgress } from "jsr:@aricart/nd-progress";

const progress = await getProgress(100);
let n = 0;
const timer = setInterval(async () => {
  await progress.update(n++);
  if (n % 23 === 0) {
    progress.log(`hi ${n}`);
  }
  if (n % 42 === 0) {
    progress.console(`hello ${n}`);
  }
  if (n === 100) {
    clearInterval(timer);
  }
}, 1000);
```
