import type { Experiment, Test } from "../test.ts";
import { nth } from "../utils.ts";
import { MIN_ITERS } from "./constants.ts";
import { stepVariantCalibrate } from "./stepVariantCalibrate.ts";
import type { TestData, VariantData } from "./types.ts";

export async function stepTest(experiment: Experiment<any>, testData: TestData): Promise<TestData> {
  const test = experiment.tests.get(testData.id);
  if (test == null) throw new Error(`Test not found for testData: ${testData.id}`);

  const allPresent = testData.variantData.length === experiment.variants.size;
  const allCalibrated = testData.variantData.every((v) => v.calibrated);

  if (!allPresent || !allCalibrated) {
    const testDataUpdate = await phaseCalibrateVariants(experiment, test, testData);
    return { ...testData, ...testDataUpdate };
  }

  throw new Error("Not implemented: after phaseCalibrateVariants");
}

async function phaseCalibrateVariants(
  experiment: Experiment<any>,
  test: Test<any>,
  testData: TestData,
): Promise<Partial<TestData>> {
  const { variantData } = testData;
  let prev = [...variantData];
  let current = prev.pop();
  if (current?.calibrated) {
    prev = [...prev, current];
    current = undefined;
    throw new Error("BREAK");
  }
  if (current == null) {
    const updatedTestData = await phaseInitVariant(experiment, test, variantData.length);
    return { variantData: [...prev, updatedTestData] };
  }

  const updatedVariantData = await stepVariantCalibrate(experiment, test, current);
  return { variantData: [...prev, updatedVariantData] };
}

async function phaseInitVariant(
  experiment: Experiment<any>,
  test: Test<any>,
  nextVariantIndex: number,
): Promise<VariantData> {
  const variant = nth(experiment.variants.values(), nextVariantIndex);
  if (variant == null)
    throw new Error(`Variant with index ${nextVariantIndex} not found in experiment ${experiment.name}`);
  console.log(
    `\
Initializing variant (${variant.id}) "${variant.name}" \
for test (${test.id}) "${test.name}" \
for experiment (${experiment.id}) "${experiment.name}".\
`,
  );
  return {
    id: variant.id,
    iters: MIN_ITERS,
    calibrated: false,
    samples: [],
  };
}
