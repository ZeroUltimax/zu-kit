import type { Failure, Result, Success } from "../type.ts";
import { get, getFail } from "./get.ts";
import { isFail, isSucc } from "./guard.ts";

export function and<F>(a: Failure<F>, b: Result<unknown, unknown>): Failure<F>;
export function and<B extends Result<unknown, unknown>>(a: Success<unknown>, b: B): B;
export function and<F, B extends Result<unknown, unknown>>(a: Result<unknown, F>, b: B): Failure<F> | B;
export function and<F, T, G>(a: Result<unknown, F>, b: Result<T, G>): Result<T, F | G> {
  if (isFail(a)) return a;
  return b;
}

export function or<S>(a: Success<S>, b: Result<unknown, unknown>): Success<S>;
export function or<B extends Result<unknown, unknown>>(a: Failure<unknown>, b: B): B;
export function or<S, B extends Result<unknown, unknown>>(a: Result<S, unknown>, b: B): Success<S> | B;
export function or<S, T, G>(a: Result<S, unknown>, b: Result<T, G>): Result<S | T, G> {
  if (isSucc(a)) return a;
  return b;
}

export function andThen<_S, F>(a: Failure<F>, b: (s: _S) => Result<unknown, unknown>): Failure<F>;
export function andThen<S, B extends Result<unknown, unknown>>(a: Success<S>, b: (s: S) => B): B;
export function andThen<S, F, B extends Result<unknown, unknown>>(a: Result<S, F>, b: (s: S) => B): Failure<F> | B;
export function andThen<S, F, T, G>(a: Result<S, F>, b: (s: S) => Result<T, G>): Result<T, F | G> {
  if (isFail(a)) return a;
  return b(get(a));
}

export function orElse<S, _F>(a: Success<S>, b: (f: _F) => Result<unknown, unknown>): Success<S>;
export function orElse<F, B extends Result<unknown, unknown>>(a: Failure<F>, b: (f: F) => B): B;
export function orElse<S, F, B extends Result<unknown, unknown>>(a: Result<S, F>, b: (f: F) => B): Success<S> | B;
export function orElse<S, F, T, G>(a: Result<S, F>, b: (f: F) => Result<T, G>): Result<S | T, G> {
  if (isSucc(a)) return a;
  return b(getFail(a));
}
