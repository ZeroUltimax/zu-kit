import { experiments } from "../experiments/index.ts";
import type { TrialWorkLoopOptions } from "./index.ts";
import type { TrialData } from "./types.ts";

export async function stepInitializeTrialMeta(options: TrialWorkLoopOptions): Promise<TrialData> {
  const experimentById = experiments.find((x) => x.id === options.experimentIdOrName);
  const experimentByName = experiments.find((x) => x.name === options.experimentIdOrName);
  const experiment = experimentById ?? experimentByName;
  if (!experiment) throw new Error(`Experiment not found: ${options.experimentIdOrName}`);
  const id = new Date().toISOString();

  console.info(`Initializing trial [${id}] for experiment "${experiment.name}" (${experiment.id}).`);
  return {
    meta: { id, experiment: experiment.id },
  };
}
