import type { Test, TestFactory } from "../../../test.ts";
import type { ObjVariant, ResultFormatVariant } from "../variantType.ts";

function test<SS, FF>(module: ObjVariant<SS, FF>, rand0: number, acc: number): number {
  if (rand0 < 0.5) {
    const result = module.fail({ failed: rand0 });
    return acc - module.getFail(result).failed;
  } else {
    const result = module.succ({ succeeded: rand0 });
    return acc + module.get(result).succeeded;
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand = Math.random();
    yield (acc: number) => test(module, rand, acc);
  }
};

export const allocObj: Test<ResultFormatVariant> = {
  id: "2.2",
  name: "allocObj",
  factory,
};
