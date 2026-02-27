import type { Variant } from "../../../perf/test.ts";
import type { ResultFormatVariant } from "../variantType.ts";

type Success<S> = [S];
type Failure<F> = [null, F];

type Result<S, F> = Success<S> | Failure<F>;

function succ<S>(s: S): Success<S> {
  return [s];
}

function fail<F>(f: NonNullable<F>): Failure<F> {
  return [null, f];
}

function isSucc<S, F>(r: Result<S, F>): r is Success<S> {
  return r.length === 1;
}

function isFail<S, F>(r: Result<S, F>): r is Failure<F> {
  return r.length !== 1;
}

function get<S>(s: Success<S>): S {
  return s[0];
}

function getFail<F>(f: Failure<F>): F {
  return f[1];
}

function map<S, F, T>(r: Result<S, F>, proj: (s: S) => T): Result<T, F> {
  if (isFail(r)) return r;
  return succ(proj(get(r)));
}

function andThen<S, F, T, G>(
  a: Result<S, F>,
  b: (s: S) => Result<T, G>,
): Result<T, F | G> {
  if (isFail(a)) return a;
  return b(get(a));
}

function orElse<S, F, T, G>(
  a: Result<S, F>,
  b: (f: F) => Result<T, G>,
): Result<S | T, G> {
  if (isSucc(a)) return a;
  return b(getFail(a));
}

export const arrayPartialSucc: Variant<ResultFormatVariant> = {
  id: "5.2",
  name: "arrayPartialSucc",
  value: { succ, fail, isSucc, isFail, get, getFail, map, andThen, orElse },
};
