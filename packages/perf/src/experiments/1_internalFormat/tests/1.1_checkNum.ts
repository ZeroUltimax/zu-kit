import type { Test, TestFactory } from "../../../test.ts";
import type { NumVariant, ResultFormatVariant } from "../variantType.ts";

function test<SS, FF>(module: NumVariant<SS, FF>, result: SS | FF, acc: number): number {
  if (module.isFail(result)) {
    return acc - module.getFail(result);
  } else {
    return acc + module.get(result);
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand = Math.random();
    const result: any = rand < 0.5 ? module.fail(rand) : module.succ(rand);
    yield (acc: number) => test(module, result, acc);
  }
};

export const checkNum: Test<ResultFormatVariant> = {
  id: "1.1",
  name: "checkNum",
  factory,
};
