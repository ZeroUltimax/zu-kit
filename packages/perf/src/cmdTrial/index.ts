import { Command } from "commander";

import { experiments } from "../experiments/index.ts";
import { loadTrial, saveTrial } from "./fileIO.ts";
import { stepFinishTrial } from "./stepFinishTrial.ts";
import { stepInitTests } from "./stepInitTests.ts";
import { stepInitTrial } from "./stepInitTrial.ts";
import { stepRunTests } from "./stepRunTests.ts";
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

    const updatedTrial = await performTrialWork(trial, options);

    await saveTrial(updatedTrial);
    if (updatedTrial.done) break;
  }
}

async function performTrialWork(trialData: TrialData, options: TrialWorkLoopOptions): Promise<TrialData> {
  // Step 1: Ensure meta exists
  if (trialData.id == null || trialData.experimentId == null) {
    // Optionally, you can use options.experimentId or experimentName here in the future
    const trialUpdate = await stepInitTrial(options);
    return { ...trialData, ...trialUpdate };
  }

  const { experimentId } = trialData;
  const experiment = experiments.get(experimentId);
  if (experiment == null) throw new Error(`Experiment not found for trial: ${experimentId}`);

  if (trialData.testData == null) {
    const trialUpdate = await stepInitTests();
    return { ...trialData, ...trialUpdate };
  }

  const { testData } = trialData;
  const allPresent = testData.length === experiment.tests.size;
  const allDone = testData.every((t) => t.done);
  if (allPresent && allDone) return stepFinishTrial();

  const testDataUpdate = await stepRunTests(experiment, testData);
  return {
    ...trialData,
    testData: testDataUpdate,
  };
}
