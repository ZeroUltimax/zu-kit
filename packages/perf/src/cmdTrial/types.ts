// All fields optional for resumability

export interface TrialData {
  meta?: TrialMeta;
  currentTestIdx?: number;
  tests?: TestData[];
}

export interface TrialMeta {
  id: string;
  experiment: string;
}
export type TestData = {};
