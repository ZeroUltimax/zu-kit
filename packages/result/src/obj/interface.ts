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
  getElse<DS>(def: (f: F) => DS): S | DS;

  // Maps
  map<T>(proj: (s: S) => T): Succ<T> | Fail<F>;
  mapFail<G>(projFail: (f: F) => G): Succ<S> | Fail<G>;
  mapOr<T, U>(proj: (s: S) => T, def: U): T | U;
  mapElse<T, G>(proj: (s: S) => T, projFail: (f: F) => G): T | G;

  // Combiners
  and<B extends IRes<unknown, unknown>>(b: B): Fail<F> | B;
  or<B extends IRes<unknown, unknown>>(b: B): Succ<S> | B;
  andThen<B extends IRes<unknown, unknown>>(b: (s: S) => B): Fail<F> | B;
  orElse<B extends IRes<unknown, unknown>>(b: (f: F) => B): Succ<S> | B;

  // Transmuters
  awaited(): Promise<Succ<Awaited<S>> | Fail<F>>;
  throwing(): S;
  throwingAsync(): Promise<Awaited<S>>;
}
