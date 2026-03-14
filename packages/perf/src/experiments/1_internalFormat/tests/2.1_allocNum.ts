import type { Test, TestFactory } from "../../../perf/test.ts";
import type { NumVariant, ResultFormatVariant } from "../variantType.ts";

function test<SS, FF>(
  module: NumVariant<SS, FF>,
  rand0: number,
  acc: number,
): number {
  if (rand0 < 0.5) {
    const result = module.fail(rand0);
    return acc - module.getFail(result);
  } else {
    const result = module.succ(rand0);
    return acc + module.get(result);
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand = Math.random();
    yield (acc: number) => test(module, rand, acc);
  }
};

export const allocNum: Test<ResultFormatVariant> = {
  id: "2.1",
  name: "allocNum",
  factory,
};
