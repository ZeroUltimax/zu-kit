// All fields optional for resumability

export interface TrialData {
  id: string;
  experimentId: string;
  testData: TestData[];
  done?: true;
}

export interface TestData {
  id: string;
  variantData: VariantData[];
  done?: true;
}

export interface VariantData {
  id: string;
  iters: number;
  calibrated: boolean;
  samples: number[];
}
