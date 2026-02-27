import assert from "node:assert";
import path from "node:path";

import { Command } from "commander";

import { experiments } from "../../result/__experiments__/index.ts";
import { type Experiment, instantiateTests } from "./test.ts";

export const cmdVariant: Command = new Command(".variant")
  .description(
    "Internal command used by the experiment to execute a specific test:variant case. Not meant to be called directly.",
  )
  .argument("<experiment>", "Experiment ID or Name")
  .argument("test", "Test ID or Name")
  .argument("variant", "Variant ID or Name")
  .argument("samples", "Sample count", Number)
  .argument("iterations", "Iteration count", Number)
  .option("--experiment-src <file>", "Experiment source file", "__experiments__/index.ts")
  .action(actionVariant);

// interface VariantOptions {
//   experimentSrc: string;
// }

async function actionVariant(
  experimentIdOrName: string,
  testIdOrName: string,
  variantIdOrName: string,
  sampleCount: number,
  iters: number,
  // { experimentSrc }: VariantOptions,
): Promise<void> {
  const experimentById = experiments.find((x) => x.id === experimentIdOrName);
  const experimentByName = experiments.find((x) => x.name === experimentIdOrName);
  const experiment = experimentById ?? experimentByName;
  if (!experiment) throw new Error(`Experiment not found: ${experimentIdOrName}`);

  const { tests, variants } = experiment;

  const testById = tests.find((t) => t.id === testIdOrName);
  const testByName = tests.find((t) => t.name === testIdOrName);
  const test = testById ?? testByName;
  if (!test) throw new Error(`Test not found: ${testIdOrName}`);

  const variantById = variants.find((v) => v.id === variantIdOrName);
  const variantByName = variants.find((v) => v.name === variantIdOrName);
  const variant = variantById ?? variantByName;
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
  const testInstances = instantiateTests(test.factory, variant.value, iters);
  assert.equal(testInstances.length, iters);

  console.info(`Warmup Phase...`);
  for (let i = 0; i < iters; i++) acc = testInstances[i]!(acc);

  console.info(`Benchmark Phase...`);
  const samples: number[] = [];

  const divisions = Math.min(sampleCount, 50);
  let nextDiv = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const start = performance.now();
    for (let i = 0; i < iters; i++) acc = testInstances[i]!(acc);
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
