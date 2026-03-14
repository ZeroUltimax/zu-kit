import type { Experiment } from "../test.ts";
import { internalFormat } from "./1_internalFormat/index.ts";

const _experiments = [internalFormat];

export const experiments: Map<string, Experiment<any>> = new Map<string, Experiment<any>>(
  _experiments.map((x) => [x.id, x]),
);
