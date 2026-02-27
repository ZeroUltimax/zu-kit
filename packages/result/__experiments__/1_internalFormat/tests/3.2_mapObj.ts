import type { Test, TestFactory } from "../../../perf/test.ts";
import type {
  ObjSucc,
  ObjVariant,
  ResultFormatVariant,
} from "../variantType.ts";

function double(x: ObjSucc): ObjSucc {
  return { succeeded: x.succeeded * 2 };
}

function test<SS, FF>(
  module: ObjVariant<SS, FF>,
  result: SS | FF,
  acc: number,
): number {
  const mapped = module.map(result, double);

  if (module.isFail(mapped)) {
    return acc - module.getFail(mapped).failed;
  } else {
    return acc + module.get(mapped).succeeded;
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

export const mapObj: Test<ResultFormatVariant> = {
  id: "3.2",
  name: "mapObj",
  factory,
};
