import type { TrialData } from "./types.ts";

export async function stepInitializeTests(): Promise<TrialData> {
  return { currentTestIdx: 0, tests: [] };
}
