// All fields optional for resumability

export interface TrialData {
  id?: string;
  experimentId?: string;
  currentTestId?: number;
  tests?: TestData[];
}

export type TestData = {};
