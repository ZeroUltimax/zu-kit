import type { Experiment } from "../test.ts";
import { nth } from "../utils.ts";
import { stepTest } from "./stepTest.ts";
import type { TestData } from "./types.ts";

export async function stepTests(experiment: Experiment<any>, testData: TestData[]): Promise<TestData[]> {
  let prev = [...testData];
  let current = prev.pop();
  if (current?.done) {
    prev = [...prev, current];
    current = undefined;
  }

  if (current == null) {
    const updatedTestData = await phaseInitTest(experiment, testData.length);
    return [...prev, updatedTestData];
  }

  const updatedTestData = await stepTest(experiment, current);
  return [...prev, updatedTestData];
}

async function phaseInitTest(experiment: Experiment<any>, nextTestIndex: number): Promise<TestData> {
  const test = nth(experiment.tests.values(), nextTestIndex);
  if (test == null) throw new Error(`Test with index ${nextTestIndex} not found in experiment ${experiment.name}`);
  console.log(`Initializing test (${test.id}) "${test.name}" for experiment (${experiment.id}) "${experiment.name}" .`);
  return {
    id: test.id,
    variantData: [],
  };
}
