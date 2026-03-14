import type { Variant } from "../../../test.ts";
import type { ResultFormatVariant } from "../variantType.ts";

// Differentiated by props only
interface Success<S> {
  readonly succ: S;
}

interface Failure<F> {
  readonly fail: NonNullable<F>;
}

type Result<S, F> = Success<S> | Failure<F>;

function succ<S>(s: S): Success<S> {
  return { succ: s };
}

function fail<F>(f: NonNullable<F>): Failure<F> {
  return { fail: f };
}

function isSucc<S, F>(r: Result<S, F>): r is Success<S> {
  return (r as Failure<F>).fail === undefined;
}

function isFail<S, F>(r: Result<S, F>): r is Failure<F> {
  return (r as Failure<F>).fail !== undefined;
}

function get<S>(s: Success<S>): S {
  return s.succ;
}

function getFail<F>(f: Failure<F>): F {
  return f.fail;
}

function map<S, F, T>(r: Result<S, F>, proj: (s: S) => T): Result<T, F> {
  if (isFail(r)) return r;
  return succ(proj(get(r)));
}

function andThen<S, F, T, G>(a: Result<S, F>, b: (s: S) => Result<T, G>): Result<T, F | G> {
  if (isFail(a)) return a;
  return b(get(a));
}

function orElse<S, F, T, G>(a: Result<S, F>, b: (f: F) => Result<T, G>): Result<S | T, G> {
  if (isSucc(a)) return a;
  return b(getFail(a));
}

export const dualCheckUndef: Variant<ResultFormatVariant> = {
  id: "2.3",
  name: "dualCheckUndef",
  value: { succ, fail, isSucc, isFail, get, getFail, map, andThen, orElse },
};
