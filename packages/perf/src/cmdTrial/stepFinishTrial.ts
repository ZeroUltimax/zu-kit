import type { TrialData } from "./types.ts";

export async function stepFinishTrial(): Promise<Partial<TrialData>> {
  console.log("All tests completed. Finishing trial...");
  return { done: true };
}
