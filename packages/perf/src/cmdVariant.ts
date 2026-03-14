import assert from "node:assert";

import { Command } from "commander";

import { experiments } from "./experiments/index.ts";
import { instantiateTests } from "./test.ts";
import { byIdOrName } from "./utils.ts";

export const cmdVariant: Command = new Command(".variant")
  .description(
    "Internal command used by the experiment to execute a specific test:variant case. Not meant to be called directly.",
  )
  .argument("<experiment>", "Experiment ID or Name")
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

  console.info(`Warmup Phase...`);
  for (const instance of instances) acc = instance(acc);

  console.info(`Benchmark Phase...`);
  const samples: number[] = [];

  const divisions = Math.min(sampleCount, 50);
  let nextDiv = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const start = performance.now();
    for (const instance of instances) acc = instance(acc);
    const end = performance.now();
    const durationMs = end - start;
    const durationNs = durationMs * 1e6;
    const durationPerIterNs = Math.round(durationNs / iters);

    samples.push(durationPerIterNs);

    const divThreshold = (sampleIndex / sampleCount) * divisions;
    while (divThreshold >= nextDiv) {
      console.log(`${sampleIndex}/${sampleCount}`);
      nextDiv++;
    }
  }
  process.send?.(samples);

  console.info(`Done!`);

  console.log(samples);
}
