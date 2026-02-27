import type { Failure, Result, Success } from "../type.ts";

export function succ<S>(s: S): Success<S> {
  return { succ: s };
}

export function fail<F>(f: NonNullable<F>): Failure<F> {
  return { fail: f };
}

export function failChecked<F>(f: F): Failure<F> {
  if (f == null) throw new TypeError("Expected not null or undefined");
  return { fail: f };
}

export function res<S>(s: S, f: null | undefined): Success<S>;
export function res<F>(s: null | undefined, f: F): Failure<F>;
export function res<S, F>(s: S | null | undefined, f: F | null | undefined): Result<S | null | undefined, F>;
export function res<S, F>(s: S | null | undefined, f: F | null | undefined): Result<S | null | undefined, F> {
  if (f != null) return fail(f);
  return succ(s);
}
