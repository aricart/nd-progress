import { test } from "node:test";
import assert from "node:assert/strict";
import { progressFactory } from "../src/mod.ts";

test("progressFactory - creates progress bar with valid max", async () => {
  const progress = await progressFactory(100);
  assert.equal(typeof progress, "object");
  assert.equal(typeof progress.update, "function");
  assert.equal(typeof progress.message, "function");
  assert.equal(typeof progress.log, "function");
  assert.equal(typeof progress.stop, "function");
  progress.stop();
});

test("progressFactory - rejects negative max", async () => {
  await assert.rejects(
    async () => await progressFactory(-1),
    {
      name: "Error",
      message: "max must be a positive finite number",
    },
  );
});

test("progressFactory - rejects zero max", async () => {
  await assert.rejects(
    async () => await progressFactory(0),
    {
      name: "Error",
      message: "max must be a positive finite number",
    },
  );
});

test("progressFactory - rejects infinity", async () => {
  await assert.rejects(
    async () => await progressFactory(Infinity),
    {
      name: "Error",
      message: "max must be a positive finite number",
    },
  );
});

test("progressFactory - rejects NaN", async () => {
  await assert.rejects(
    async () => await progressFactory(NaN),
    {
      name: "Error",
      message: "max must be a positive finite number",
    },
  );
});

test("progress - update method works", async () => {
  const progress = await progressFactory(10);
  // should not throw
  await progress.update(5);
  await progress.update(10);
  progress.stop();
});

test("progress - message method works", async () => {
  const progress = await progressFactory(10);
  // should not throw
  await progress.message("test message");
  progress.stop();
});

test("progress - log method works", async () => {
  const progress = await progressFactory(10);
  // should not throw
  await progress.log("test log");
  progress.stop();
});

test("progress - can be stopped multiple times", async () => {
  const progress = await progressFactory(10);
  progress.stop();
  progress.stop(); // should not throw
});

test("progress - full lifecycle test", async () => {
  const progress = await progressFactory(100);

  for (let i = 0; i <= 100; i += 10) {
    await progress.update(i);
    if (i === 50) {
      await progress.message("halfway there");
    }
  }

  await progress.log("complete");
  progress.stop();
});
