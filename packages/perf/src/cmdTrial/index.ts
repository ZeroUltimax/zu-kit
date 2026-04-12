import { Command } from "commander";

import { loadTrial, saveTrial } from "./fileIO.ts";
import { stepTrial, type TrialOptions } from "./stepTrial.ts";

export const cmdTrial: Command = new Command("trial")
  .description("Execute a trial for a specified experiment.")
  .argument("experiment", "Experiment ID or Name")
  .action(actionTrial);

async function actionTrial(experimentIdOrName: string): Promise<void> {
  const options: TrialOptions = { experimentIdOrName };
  await trialWorkLoop(options);
}

async function trialWorkLoop(options: TrialOptions): Promise<void> {
  // Main work loop skeleton
  while (true) {
    const trial = await loadTrial();

    const updatedTrial = await stepTrial(trial, options);

    await saveTrial(updatedTrial);
    if (updatedTrial.done) break;
  }
}
