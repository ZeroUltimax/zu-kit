import { ksTest } from "../math.ts";
import type { Experiment, Test } from "../test.ts";
import { CALIBRATE_SAMPLES, ITERS_MULTIPLIER } from "./constants.ts";
import { obtainSamples } from "./obtainSamples.ts";
import type { VariantData } from "./types.ts";

export async function stepVariantCalibrate(
  experiment: Experiment<any>,
  test: Test<any>,
  variantData: VariantData,
): Promise<VariantData> {
  const { id, iters, samples: prevSamples } = variantData;
  const variant = experiment.variants.get(id);
  if (!variant) {
    throw new Error(`Variant with id ${id} not found in experiment ${experiment.id}`);
  }

  if (prevSamples.length === 0) {
    const samples = await obtainSamples(experiment.id, test.id, variant.id, CALIBRATE_SAMPLES, iters);
    // Save the first samples for the next step
    return {
      ...variantData,
      samples, // Save the first samples, since they`re needed for the next step.
    };
  }

  const nextIters = iters * ITERS_MULTIPLIER;
  const nextSamples = await obtainSamples(experiment.id, test.id, variant.id, CALIBRATE_SAMPLES, nextIters);

  // Kolmogorov-Smirnov test
  const { pValue } = ksTest(prevSamples, nextSamples);

  // Print samples (both)
  console.log(`Previous samples (iters=${iters}):`, prevSamples);
  console.log(`Next samples (iters=${nextIters}):`, nextSamples);

  console.log(`KS p-value: ${pValue}`);

  // Use p-value threshold for calibration
  const CALIBRATE_P_THRESHOLD = 0.05; // Typical significance threshold
  if (pValue > CALIBRATE_P_THRESHOLD) {
    // Distributions are not significantly different, calibration done
    return {
      ...variantData,
      calibrated: true,
      samples: nextSamples,
    };
  } else {
    // Distributions are significantly different, increase iters and repeat
    return {
      ...variantData,
      iters: nextIters,
      samples: nextSamples,
    };
  }
}
