import { assertEquals, assertRejects } from "@std/assert";
import { progressFactory } from "../src/mod.ts";

// disable sanitization for all tests since progress bars have async console operations
const testOptions = {
  sanitizeOps: false,
  sanitizeResources: false,
};

Deno.test({
  name: "progressFactory - creates progress bar with valid max",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(100);
    assertEquals(typeof progress, "object");
    assertEquals(typeof progress.update, "function");
    assertEquals(typeof progress.message, "function");
    assertEquals(typeof progress.log, "function");
    assertEquals(typeof progress.stop, "function");
    progress.stop();
  },
});

Deno.test({
  name: "progressFactory - rejects negative max",
  ...testOptions,
  fn: async () => {
    await assertRejects(
      async () => await progressFactory(-1),
      Error,
      "max must be a positive finite number",
    );
  },
});

Deno.test({
  name: "progressFactory - rejects zero max",
  ...testOptions,
  fn: async () => {
    await assertRejects(
      async () => await progressFactory(0),
      Error,
      "max must be a positive finite number",
    );
  },
});

Deno.test({
  name: "progressFactory - rejects infinity",
  ...testOptions,
  fn: async () => {
    await assertRejects(
      async () => await progressFactory(Infinity),
      Error,
      "max must be a positive finite number",
    );
  },
});

Deno.test({
  name: "progressFactory - rejects NaN",
  ...testOptions,
  fn: async () => {
    await assertRejects(
      async () => await progressFactory(NaN),
      Error,
      "max must be a positive finite number",
    );
  },
});

Deno.test({
  name: "progress - update method works",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(10);
    // should not throw
    await progress.update(5);
    await progress.update(10);
    progress.stop();
  },
});

Deno.test({
  name: "progress - message method works",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(10);
    // should not throw
    await progress.message("test message");
    progress.stop();
  },
});

Deno.test({
  name: "progress - log method works",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(10);
    // should not throw
    await progress.log("test log");
    progress.stop();
  },
});

Deno.test({
  name: "progress - can be stopped multiple times",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(10);
    progress.stop();
    progress.stop(); // should not throw
  },
});

Deno.test({
  name: "progress - full lifecycle test",
  ...testOptions,
  fn: async () => {
    const progress = await progressFactory(100);

    for (let i = 0; i <= 100; i += 10) {
      await progress.update(i);
      if (i === 50) {
        await progress.message("halfway there");
      }
    }

    await progress.log("complete");
    progress.stop();
  },
});
