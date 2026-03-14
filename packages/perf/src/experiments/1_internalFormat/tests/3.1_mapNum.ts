import type { Test, TestFactory } from "../../../test.ts";
import type { NumVariant, ResultFormatVariant } from "../variantType.ts";

function double(x: number): number {
  return x * 2;
}

function test<SS, FF>(module: NumVariant<SS, FF>, result: SS | FF, acc: number): number {
  const mapped = module.map(result, double);

  if (module.isFail(mapped)) {
    return acc - module.getFail(mapped);
  } else {
    return acc + module.get(mapped);
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand = Math.random();
    const result: any = rand < 0.5 ? module.fail(rand) : module.succ(rand);
    yield (acc: number) => test(module, result, acc);
  }
};

export const mapNum: Test<ResultFormatVariant> = {
  id: "3.1",
  name: "mapNum",
  factory,
};
