import type { Failure, Result, Success } from "../type.ts";

export function isSucc<S, F>(r: Result<S, F>): r is Success<S> {
  return r.fail == null;
}

export function isFail<S, F>(r: Result<S, F>): r is Failure<F> {
  return r.fail != null;
}
