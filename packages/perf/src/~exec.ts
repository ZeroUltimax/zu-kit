// Testing ground for internal format performance benchmarks
// Must test individually map, andThen, orElse.
// Must test combined operations.

import cp from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { testIterations } from "../utils/test.ts";
import { tests } from "./tests/index.ts";
import { variants } from "./variants/index.ts";

// Log console program arguments
const [executable, program, ...args] = process.argv;
const nodeArgs = process.execArgv;

if (args.length === 0) {
  // Master mode: spawn separate processes for each variant
  const testEntries = Object.entries(tests);
  const variantEntries = Object.entries(variants);
  const timestamp = Date.now();

  for (let ti = 0; ti < testEntries.length; ti++) {
    for (let vi = 0; vi < variantEntries.length; vi++) {
      const expectedFile = path.resolve(import.meta.dirname, `_samples/${timestamp}/test${ti}_variant${vi}.json`);
      const child = cp.spawn(executable, [...nodeArgs, program, ti.toString(), vi.toString(), expectedFile], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      const exitCode: number = await new Promise((resolve) => {
        child.on("close", resolve);
      });
      if (exitCode !== 0) {
        console.error(`Child process exited with code ${exitCode}`);
        process.exit(exitCode);
      }
    }
  }

  process.exit(0);
}

const [testIndexStr, variantIndexStr, outFile] = args;
const testIndex = Number(testIndexStr);
const variantIndex = Number(variantIndexStr);

const testEntries = Object.entries(tests);
const variantEntries = Object.entries(variants);

const [testName, testFunc] = testEntries[testIndex];
const [variantName, variantModule] = variantEntries[variantIndex];

console.log(`Running test "${testName}", with variant: "${variantName}"`);

const sampleCount = 1000;
const benchIters = 5_000_000;

let acc = 0;
const iters = testIterations(variantModule, benchIters, testFunc);
console.log("Warming up");
for (let i = 0; i < benchIters; i++) acc = iters[i](acc);

console.log("Benchmarking");
const divisions = 50;
let nextDiv = 0;

const samples: number[] = [];
for (let si = 0; si < sampleCount; si++) {
  const start = performance.now();
  for (let i = 0; i < benchIters; i++) acc = iters[i](acc);
  const end = performance.now();
  const duration = end - start;

  samples.push(duration);

  const divThreshold = (si / sampleCount) * divisions;
  while (divThreshold >= nextDiv) {
    console.log(`${si}/${sampleCount}`);
    nextDiv++;
  }
}

// Write samples to output file
const outDir = path.dirname(outFile);
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  outFile,
  JSON.stringify({
    testName,
    variantName,
    sampleCount,
    benchIters,
    acc,
    samples,
  }),
  "utf-8",
);
