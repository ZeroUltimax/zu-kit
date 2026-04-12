import { experiments } from "../experiments/index.ts";
import { byIdOrName } from "../utils.ts";
import { stepTests } from "./stepTests.ts";
import type { TrialData } from "./types.ts";

export interface TrialOptions {
  experimentIdOrName: string;
}

export async function stepTrial(trialData: TrialData | undefined, options: TrialOptions): Promise<TrialData> {
  if (trialData == null) {
    const trialUpdate = await phaseInitTrial(options);
    return { ...trialUpdate };
  }

  const { experimentId } = trialData;
  const experiment = experiments.get(experimentId);
  if (experiment == null) throw new Error(`Experiment not found for trial: ${experimentId}`);

  const { testData } = trialData;
  const allPresent = testData.length === experiment.tests.size;
  const allDone = testData.every((t) => t.done);
  if (allPresent && allDone) {
    const trialUpdate = await phaseFinishTrial();
    return { ...trialData, ...trialUpdate };
  }

  const testDataUpdate = await stepTests(experiment, testData);
  return {
    ...trialData,
    testData: testDataUpdate,
  };
}

export async function phaseInitTrial(options: TrialOptions): Promise<TrialData> {
  const experiment = byIdOrName(experiments, options.experimentIdOrName);
  if (!experiment) throw new Error(`Experiment not found: ${options.experimentIdOrName}`);
  const id = new Date().toISOString();

  console.info(`Initializing trial [${id}] with experiment (${experiment.id}) "${experiment.name}" .`);
  return {
    id,
    experimentId: experiment.id,
    testData: [],
  };
}

export async function phaseFinishTrial(): Promise<Partial<TrialData>> {
  console.log("All tests completed. Finishing trial...");
  return { done: true };
}
