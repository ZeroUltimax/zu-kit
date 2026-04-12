import assert from "node:assert";

import { Command } from "commander";

import { experiments } from "./experiments/index.ts";
import { instantiateTests } from "./test.ts";
import { byIdOrName } from "./utils.ts";

export const cmdVariant: Command = new Command(".variant")
  .description(
    "Internal command used by the experiment to execute a specific test:variant case. Not meant to be called directly.",
  )
  .argument("experiment", "Experiment ID or Name")
  .argument("test", "Test ID or Name")
  .argument("variant", "Variant ID or Name")
  .argument("samples", "Sample count", Number)
  .argument("iterations", "Iteration count", Number)
  .action(actionVariant);

async function actionVariant(
  experimentIdOrName: string,
  testIdOrName: string,
  variantIdOrName: string,
  sampleCount: number,
  iters: number,
  // { experimentSrc }: VariantOptions,
): Promise<void> {
  if (global.gc == null) {
    console.error("Garbage collection is not exposed. Run the command with `--expose-gc` to enable it.");
    process.exit(1);
  }

  const experiment = byIdOrName(experiments, experimentIdOrName);

  if (!experiment) throw new Error(`Experiment not found: ${experimentIdOrName}`);

  const { tests, variants } = experiment;

  const test = byIdOrName(tests, testIdOrName);
  if (!test) throw new Error(`Test not found: ${testIdOrName}`);

  const variant = byIdOrName(variants, variantIdOrName);
  if (!variant) throw new Error(`Variant not found: ${variantIdOrName}`);

  console.info(
    `
Experiment "${experiment.name}" (${experiment.id})
Test "${test.name}" (${test.id})
Variant "${variant.name}" (${variant.id})
`,
  );

  console.info(`Instantiating tests...`);
  let acc = 0;
  const instances = instantiateTests(test.factory, variant.value, iters);
  assert.equal(instances.length, iters);

  // Two warmup runs is sufficient to get past any initialization overhead,
  // and to trigger any JIT optimizations in the case of JavaScript engines.
  console.info(`Warmup Phase...`);
  for (const instance of instances) acc = instance(acc);
  for (const instance of instances) acc = instance(acc);

  console.info(`Benchmark Phase...`);
  const samples: number[] = [];

  const divisions = Math.min(sampleCount, 10);
  let nextDiv = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    global.gc();
    const start = performance.now();
    for (const instance of instances) acc = instance(acc);
    const end = performance.now();
    const durationMs = end - start;
    const durationNs = durationMs * 1e6;

    const durationPerIterNs = Math.round((durationNs / iters) * 1e2) / 1e2;

    samples.push(durationPerIterNs);

    const divThreshold = (sampleIndex / sampleCount) * divisions;
    while (divThreshold >= nextDiv) {
      console.log(`${sampleIndex}/${sampleCount}`);
      nextDiv++;
    }
  }
  samples.sort((a, b) => a - b);
  process.send?.(samples);

  console.info(`Done!`);
}
