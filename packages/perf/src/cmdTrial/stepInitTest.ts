import type { Experiment } from "../test.ts";
import { nth } from "../utils.ts";
import type { TestData } from "./types.ts";

export async function stepInitTest(experiment: Experiment<any>, nextTestIndex: number): Promise<Partial<TestData>> {
  const test = nth(experiment.tests.values(), nextTestIndex);
  if (test == null) throw new Error(`Test with index ${nextTestIndex} not found in experiment ${experiment.name}`);
  console.log(`Initializing test (${test.id}) "${test.name}" for experiment (${experiment.id}) "${experiment.name}" .`);
  return {
    id: test.id,
    variantData: [],
  };
}
