import { experiments } from "../experiments/index.ts";
import { byIdOrName } from "../utils.ts";
import type { TrialWorkLoopOptions } from "./index.ts";
import type { TrialData } from "./types.ts";

export async function stepInitTrial(options: TrialWorkLoopOptions): Promise<Partial<TrialData>> {
  const experiment = byIdOrName(experiments, options.experimentIdOrName);
  if (!experiment) throw new Error(`Experiment not found: ${options.experimentIdOrName}`);
  const id = new Date().toISOString();

  console.info(`Initializing trial [${id}] with experiment (${experiment.id}) "${experiment.name}" .`);
  return {
    id,
    experimentId: experiment.id,
  };
}
