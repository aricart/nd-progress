# nd-progress

A trivial progress bar wrapper for
["jsr:@deno-library/progress"](https://github.com/deno-library/progress) and
["npm:cli-progress"](https://github.com/npkgz/cli-progress) that runs in Deno or
Node.js with the same API. Note that configuration of the progress bars is very
limited, as the intention is to provide cross-runtime support for a progress
bar.

## Installation

### Deno

```typescript
import { progressFactory } from "jsr:@aricart/nd-progress";
```

### Node.js

```bash
npm install @aricart/nd-progress
```

```typescript
import { progressFactory } from "@aricart/nd-progress";
```

## Usage

The API is identical across both runtimes:

```typescript
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
```

## API

### `progressFactory(max: number): Promise<Progress>`

Creates a new progress bar with the specified maximum value.

**Parameters:**
- `max` - the maximum value for the progress bar (must be a positive finite number)

**Returns:** A Promise that resolves to a `Progress` instance

**Throws:** Error if max is not a positive finite number

### Progress Interface

#### `update(n: number): Promise<void>`
Updates the progress bar to the specified value.

#### `message(s: string): Promise<void>`
Writes a message on top of the progress bar.

#### `log(s: string): Promise<void>`
Logs a message with a timestamp.

#### `stop(): void`
Stops the progress bar.
