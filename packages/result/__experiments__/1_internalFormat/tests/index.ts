import type { Test } from "../../../perf/test.ts";
import type { ResultFormatVariant } from "../variantType.ts";
import { checkNum } from "./1.1_checkNum.ts";
import { checkObj } from "./1.2_checkObj.ts";
import { allocNum } from "./2.1_allocNum.ts";
import { allocObj } from "./2.2_allocObj.ts";
import { mapNum } from "./3.1_mapNum.ts";
import { mapObj } from "./3.2_mapObj.ts";
import { chainNum } from "./4.1_chainNum.ts";
import { chainObj } from "./4.2_chainObj.ts";

export const tests: Test<ResultFormatVariant>[] = [
  checkNum,
  checkObj,
  allocNum,
  allocObj,
  mapNum,
  mapObj,
  chainNum,
  chainObj,
];
