import type { Test, TestFactory } from "../../../test.ts";
import type { ObjVariant, ResultFormatVariant } from "../variantType.ts";

function thenRand<SS, FF>(module: ObjVariant<SS, FF>, res: number, rand: number): SS | FF {
  if (rand > res) {
    return module.succ({ succeeded: rand });
  } else {
    return module.fail({ failed: rand });
  }
}

function test<SS, FF>(module: ObjVariant<SS, FF>, rand0: SS | FF, rand1: number, rand2: number, acc: number): number {
  const andThened = module.andThen(rand0, (res) => thenRand(module, res.succeeded, rand1));
  const orElsed = module.orElse(andThened, (res) => thenRand(module, res.failed, rand2));

  if (module.isFail(orElsed)) {
    return acc - module.getFail(orElsed).failed;
  } else {
    return acc + module.get(orElsed).succeeded;
  }
}

const factory: TestFactory<ResultFormatVariant> = function* (module) {
  while (true) {
    const rand0 = Math.random();
    const rand1 = Math.random();
    const rand2 = Math.random();
    const result: any = rand0 < 0.5 ? module.fail({ failed: rand0 }) : module.succ({ succeeded: rand0 });
    yield (acc: number) => test(module, result, rand1, rand2, acc);
  }
};

export const chainObj: Test<ResultFormatVariant> = {
  id: "4.2",
  name: "chainObj",
  factory,
};
