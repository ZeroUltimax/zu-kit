import type { Experiment } from "../perf/test.ts";
import { internalFormat } from "./1_internalFormat/index.ts";

export const experiments: Experiment<any>[] = [internalFormat];
