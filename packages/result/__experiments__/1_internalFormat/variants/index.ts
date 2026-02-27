import type { Variant } from "../../../perf/test.ts";
import type { ResultFormatVariant } from "../variantType.ts";
import { monoFlagged } from "./1.1_monoFlagged.ts";
import { dualFlagged } from "./1.2_dualFlagged.ts";
import { mirrorFlagged } from "./1.3_mirrorFlagged.ts";
import { dualCheckIn } from "./2.1_dualCheckIn.ts";
import { dualCheckNullish } from "./2.2_dualCheckNullish.ts";
import { dualCheckUndef } from "./2.3_dualCheckUndefined.ts";
import { mirrorNullCheckNullish } from "./3.1_mirrorNullCheckNullish.ts";
import { mirrorNullCheckNull } from "./3.2_mirrorNullCheckNull.ts";
import { mirrorUndefCheckNullish } from "./4.1_mirrorUndefCheckNullish.ts";
import { mirrorUndefCheckUndef } from "./4.2_mirrorUndefCheckUndef.ts";
import { arrayFull } from "./5.1_arrayFull.ts";
import { arrayPartialSucc } from "./5.2_arrayPartialSucc.ts";
import { arrayPartialFail } from "./5.3_arrayPartialFail.ts";

export const variants: Variant<ResultFormatVariant>[] = [
  monoFlagged,
  dualFlagged,
  mirrorFlagged,
  dualCheckIn,
  dualCheckNullish,
  dualCheckUndef,
  mirrorNullCheckNullish,
  mirrorNullCheckNull,
  mirrorUndefCheckNullish,
  mirrorUndefCheckUndef,
  arrayFull,
  arrayPartialSucc,
];
