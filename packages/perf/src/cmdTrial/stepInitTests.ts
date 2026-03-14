import type { TrialData } from "./types.ts";

export async function stepInitTests(): Promise<TrialData> {
  console.log("Initializing tests...");
  return { testData: [] };
}
