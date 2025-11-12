import type { Failure, Result, Success } from "../type.ts";

export function succ<S>(s: S): Success<S> {
  return { succ: s, fail: null };
}

export function fail<F>(f: NonNullable<F>): Failure<F> {
  return { succ: null, fail: f };
}

export function failChecked<F>(f: F): Failure<F> {
  if (f == null) throw new TypeError("Expected not null or undefined");
  return { succ: null, fail: f };
}

export function res<S>(s: S, f: null): Success<S>;
export function res<F>(s: null, f: F): Failure<F>;
export function res<S, F>(s: S | null, f: F | null): Result<S, F>;
export function res<S, F>(s: S | null, f: F | null): Result<S, F> {
  if (f != null) return fail(f);
  return succ(s!);
}
