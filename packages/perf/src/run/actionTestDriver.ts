import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { experiments } from "../../../result/__experiments__/index.ts";
import { type CliTestArgs, getCommandArgs } from "./args.ts";

const outDir = path.resolve(import.meta.dirname, `samples`);

export async function actionTestDriver({ experimentName, testName, variantName }: CliTestArgs): Promise<void> {
  const { executable, nodeArgs, program } = getCommandArgs();

  const timestamp = Date.now();

  const runOutDir = path.resolve(outDir, `${timestamp}`);
  await fs.mkdir(runOutDir, { recursive: true });

  let chosenExperiments = experiments;
  if (experimentName) {
    chosenExperiments = experiments.filter((e) => e.name === experimentName);
    if (chosenExperiments.length === 0) {
      throw new Error(`Experiment "${experimentName}" not found`);
    }
  }
  for (let experimentI = 0; experimentI < chosenExperiments.length; experimentI++) {
    const experiment = chosenExperiments[experimentI]!;
    let chosenTests = experiment.tests;
    if (testName) {
      chosenTests = experiment.tests.filter((t) => t.name === testName);
      if (chosenTests.length === 0) {
        throw new Error(`Test "${testName}" not found in experiment "${experiment.name}"`);
      }
    }
    let chosenVariants = experiment.variants;
    if (variantName) {
      chosenVariants = experiment.variants.filter((v) => v.name === variantName);
      if (chosenVariants.length === 0) {
        throw new Error(`Variant "${variantName}" not found in experiment "${experiment.name}"`);
      }
    }
    for (let testI = 0; testI < chosenTests.length; testI++) {
      const test = chosenTests[testI]!;
      for (let variantI = 0; variantI < chosenVariants.length; variantI++) {
        const variant = chosenVariants[variantI]!;
        const outFile = path.resolve(runOutDir, `${experimentI}_${testI}_${variantI}.json`);
        const args = [...nodeArgs, program, experiment.name, test.name, variant.name, outFile];

        const child = spawn(executable, args, {
          stdio: ["ignore", "pipe", "pipe"],
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        const exitCode: number = await new Promise((resolve) => {
          child.on("close", resolve);
        });
        if (exitCode !== 0) {
          throw new Error(`Child process exited with code ${exitCode}`);
        }
      }
    }
  }
}
