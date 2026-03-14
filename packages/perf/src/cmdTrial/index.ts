import { Command } from "commander";

import { experiments } from "../experiments/index.ts";
import { loadTrial, saveTrial } from "./fileIO.ts";
import { stepInitializeTests } from "./stepInitializeTests.ts";
import { stepInitializeTrialMeta } from "./stepInitializeTrialMeta.ts";
import { stepRunTest } from "./stepRunTest.ts";
import type { TrialData } from "./types.ts";

export const cmdTrial: Command = new Command("trial")
  .description("Execute a trial for a specified experiment.")
  .argument("experiment", "Experiment ID or Name")
  .action(actionTrial);

async function actionTrial(experimentIdOrName: string): Promise<void> {
  const options: TrialWorkLoopOptions = { experimentIdOrName };
  await trialWorkLoop(options);
}

export interface TrialWorkLoopOptions {
  experimentIdOrName: string;
}

async function trialWorkLoop(options: TrialWorkLoopOptions): Promise<void> {
  // Main work loop skeleton
  while (true) {
    const trial: TrialData = await loadTrial();

    const { trial: updatedTrial, done } = await performTrialWork(trial, options);

    await saveTrial(updatedTrial);
    if (done) break;
  }
}

interface TrialWorkResult {
  trial: TrialData;
  done: boolean;
}

async function performTrialWork(trial: TrialData, options: TrialWorkLoopOptions): Promise<TrialWorkResult> {
  // Step 1: Ensure meta exists
  if (trial.meta == null) {
    // Optionally, you can use options.experimentId or experimentName here in the future
    const trialUpdate = await stepInitializeTrialMeta(options);
    return {
      trial: { ...trial, ...trialUpdate },
      done: false,
    };
  }

  if (trial.currentTestIdx == null || trial.tests == null) {
    const trialUpdate = await stepInitializeTests();
    return {
      trial: { ...trial, ...trialUpdate },
      done: false,
    };
  }

  const experimentId = trial.meta.experiment;
  const experiment = experiments.get(experimentId)!;

  if (trial.currentTestIdx < experiment.tests.length) {
    const currentTest = experiment.tests[trial.currentTestIdx]!;
    const trialUpdate = await stepRunTest(experiment, currentTest);
    return {
      trial: { ...trial, ...trialUpdate },
      done: false,
    };
  }

  // ...future steps...
  return { trial, done: true };
}
