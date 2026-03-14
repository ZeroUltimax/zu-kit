import type { Experiment } from "../test.ts";
import type { TestData } from "./types.ts";

export async function stepRunTest(experiment: Experiment<any>, testData: TestData): Promise<Partial<TestData>> {
  throw new Error("Not Implemented");
}
