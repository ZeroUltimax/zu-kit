import type { Variant } from "../../../perf/test.ts";
import type { ResultFormatVariant } from "../variantType.ts";

// Boolean flag, differentiated by flag alone
interface Success<S> {
  readonly isFail: false;
  readonly value: S;
}

interface Failure<F> {
  readonly isFail: true;
  readonly value: F;
}

type Result<S, F> = Success<S> | Failure<F>;

function succ<S>(s: S): Success<S> {
  return { isFail: false, value: s };
}

function fail<F>(f: NonNullable<F>): Failure<F> {
  return { isFail: true, value: f };
}

function isSucc<S, F>(r: Result<S, F>): r is Success<S> {
  return !r.isFail;
}

function isFail<S, F>(r: Result<S, F>): r is Failure<F> {
  return r.isFail;
}

function get<S>(s: Success<S>): S {
  return s.value;
}

function getFail<F>(f: Failure<F>): F {
  return f.value;
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

export const monoFlagged: Variant<ResultFormatVariant> = {
  id: "1.1",
  name: "monoFlagged",
  value: { succ, fail, isSucc, isFail, get, getFail, map, andThen, orElse },
};
