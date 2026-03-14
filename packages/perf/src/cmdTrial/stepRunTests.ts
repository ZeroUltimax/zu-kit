import type { Experiment } from "../test.ts";
import { stepInitTest } from "./stepInitTest.ts";
import { stepRunTest } from "./stepRunTest.ts";
import type { TestData } from "./types.ts";

export async function stepRunTests(experiment: Experiment<any>, testData: TestData[]): Promise<TestData[]> {
  // Assume either not all testData are present OR not all tests are done.
  let [current, ...prev] = testData;
  if (current?.done) {
    prev = [current, ...prev];
    current = undefined;
  }
  if (current == null) {
    const updatedTestData = await stepInitTest(experiment, testData.length);
    return [updatedTestData, ...prev];
  }

  const updatedTestData = await stepRunTest(experiment, current);
  return [updatedTestData, ...prev];
}
