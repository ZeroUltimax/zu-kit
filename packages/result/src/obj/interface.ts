import type { Fail } from "./fail.ts";
import type { Succ } from "./succ.ts";

export interface IRes<S, F> extends Iterable<S> {
  // Guards
  isSucc(): this is Succ<S>;
  isFail(): this is Fail<F>;

  // Getters
  getChecked(): S;
  getFailChecked(): NonNullable<F>;
  getOr<DS>(def: DS): S | DS;
  getElse<DS>(defFn: (f: F) => DS): S | DS;

  // Maps
  map<T>(proj: (s: S) => T): IRes<T, F>;
  mapFail<G>(projFail: (f: F) => G): IRes<S, G>;
  mapOr<T, U>(proj: (s: S) => T, def: U): T | U;
  mapElse<T, G>(proj: (s: S) => T, projFail: (f: F) => G): T | G;

  // Combiners
  and<T, G>(b: IRes<T, G>): IRes<T, F | G>;
  or<T, G>(b: IRes<T, G>): IRes<S | T, G>;
  andThen<T, G>(b: (s: S) => IRes<T, G>): IRes<T, F | G>;
  orElse<T, G>(b: (f: F) => IRes<T, G>): IRes<S | T, G>;

  // Transmuters
  awaited(): Promise<IRes<Awaited<S>, F>>;
  throwing(): S;
  throwingAsync(): Promise<Awaited<S>>;
}
