// Testing ground for internal format performance benchmarks
// Must test individually map, andThen, orElse.
// Must test combined operations.

import type { Experiment } from "../../test.ts";
import { tests } from "./tests/index.ts";
import { variants } from "./variants/index.ts";
import type { ResultFormatVariant } from "./variantType.ts";

export const internalFormat: Experiment<ResultFormatVariant> = {
  id: "1",
  name: "internalFormat",
  tests,
  variants,
};
