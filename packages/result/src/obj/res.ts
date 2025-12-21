import { get, getFail } from "../core/get.ts";
import { isFail } from "../core/guard.ts";
import { all as _all, type All } from "../core/transmute/array.ts";
import type { Failure, Result, Success } from "../type.ts";
import { Fail } from "./fail.ts";
import { Succ } from "./succ.ts";

export type Res<S, F> = Succ<S> | Fail<F>;

// Factory
export function succ<S>(s: S): Succ<S> {
  return new Succ(s);
}

export function fail<F>(f: NonNullable<F>): Fail<F> {
  return new Fail(f);
}

export function failChecked<F>(f: F): Fail<F> {
  if (f == null) throw new TypeError("Expected not null or undefined");
  return new Fail(f);
}

export function res<S>(s: S, f: null): Succ<S>;
export function res<F>(s: null, f: F): Fail<F>;
export function res<S, F>(s: S | null, f: F | null): Res<S | null, F>;
export function res<S, F>(s: S | null, f: F | null): Res<S | null, F> {
  if (f != null) return fail(f);
  return succ(s);
}

// Transmute
export function fromResult<S>(r: Success<S>): Succ<S>;
export function fromResult<F>(r: Failure<F>): Fail<F>;
export function fromResult<S, F>(r: Result<S, F>): Res<S, F>;
export function fromResult<S, F>(r: Result<S, F>): Res<S, F> {
  if (isFail(r)) return new Fail(getFail(r));
  return new Succ(get(r));
}

// biome-ignore format: Readability
type ToClass<R extends Result<unknown,unknown>> =
  [R] extends [Success<infer S>] ? Succ<S>
: [R] extends [Failure<infer F>] ? Fail< F>
: [R] extends [Result<infer S, infer F>] ? Res<S, F>
: never

export function all<const RS extends readonly Result<unknown, unknown>[] | []>(rs: RS): ToClass<All<RS>> {
  return fromResult(_all(rs)) as any;
}

export function trying<S, F = unknown>(fn: () => S): Res<S, F> {
  try {
    return new Succ(fn());
  } catch (e) {
    if (e == null) throw new TypeError("Expected non nullable error.");
    return new Fail(e as NonNullable<F>);
  }
}
export function tryify<A extends unknown[], R, F = unknown>(fn: (...args: A) => R): (...args: A) => Res<R, F> {
  return (...args) => trying(() => fn(...args));
}
