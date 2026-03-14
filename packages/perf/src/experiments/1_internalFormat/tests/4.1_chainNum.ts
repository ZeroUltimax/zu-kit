import type { Test, TestFactory } from "../../../test.ts";
import type { NumVariant, ResultFormatVariant } from "../variantType.ts";

function thenRand<SS, FF>(module: NumVariant<SS, FF>, res: number, rand: number): SS | FF {
  if (rand > res) {
    return module.succ(rand);
  } else {
    return module.fail(rand);
  }
}

function test<SS, FF>(module: NumVariant<SS, FF>, rand0: SS | FF, rand1: number, rand2: number, acc: number): number {
  const andThened = module.andThen(rand0, (res) => thenRand(module, res, rand1));
  const orElsed = module.orElse(andThened, (res) => thenRand(module, res, rand2));

  if (module.isFail(orElsed)) {
    return acc - module.getFail(orElsed);
  } else {
    return acc + module.get(orElsed);
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand0 = Math.random();
    const rand1 = Math.random();
    const rand2 = Math.random();
    const result: any = rand0 < 0.5 ? module.fail(rand0) : module.succ(rand0);
    yield (acc: number) => test(module, result, rand1, rand2, acc);
  }
};

export const chainNum: Test<ResultFormatVariant> = {
  id: "4.1",
  name: "chainNum",
  factory,
};
