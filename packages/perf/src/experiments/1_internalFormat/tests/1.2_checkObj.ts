import type { Test, TestFactory } from "../../../perf/test.ts";
import type { ObjVariant, ResultFormatVariant } from "../variantType.ts";

function test<SS, FF>(
  module: ObjVariant<SS, FF>,
  result: SS | FF,
  acc: number,
): number {
  if (module.isFail(result)) {
    return acc - module.getFail(result).failed;
  } else {
    return acc + module.get(result).succeeded;
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand = Math.random();
    const result: any =
      rand < 0.5
        ? module.fail({ failed: rand })
        : module.succ({ succeeded: rand });
    yield (acc: number) => test(module, result, acc);
  }
};

export const checkObj: Test<ResultFormatVariant> = {
  id: "1.2",
  name: "checkObj",
  factory,
};
