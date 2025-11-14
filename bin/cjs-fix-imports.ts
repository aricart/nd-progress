#!/usr/bin/env -S deno run --allow-all
// deno-lint-ignore-file no-explicit-any
import { basename, join } from "jsr:@std/path";
import { parse } from "jsr:@std/flags";
import { walk } from "jsr:@std/fs";

const argv = parse(
  Deno.args,
  {
    alias: {
      o: ["out"],
    },
    boolean: ["debug"],
    string: ["out"],
    default: {
      o: "lib",
    },
  },
);

const srcDirs = argv._.map((n) => n.toString());
const out = argv.out;

if (argv.debug) {
  console.log(`src dirs: ${srcDirs}`);
  console.log(`out: ${out}`);
}

// ensure output directory exists
await Deno.mkdir(out, { recursive: true });

for (const src of srcDirs) {
  for await (
    const we of walk(src, {
      exts: ["ts", "js", "mjs"],
      includeDirs: false,
      followSymlinks: false,
    })
  ) {
    const data = await Deno.readTextFile(we.path);
    let mod = data;

    // fix .ts extensions in imports to .js
    mod = mod.replace(/from\s+["'](\..*)\.ts["']/g, 'from "$1.js"');
    mod = mod.replace(/import\s+["'](\..*)\.ts["']/g, 'import "$1.js"');
    mod = mod.replace(/import\(["'](\..*)\.ts["']\)/g, 'import("$1.js")');

    const dest = join(out, basename(we.path));
    if (argv.debug) {
      console.log(`${we.path} => ${dest}`);
    }
    await Deno.writeTextFile(dest, mod);
  }
}
