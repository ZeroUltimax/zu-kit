import type { Failure, Result, Success } from "../../type.ts";
import { get, getFail } from "../get.ts";
import { isFail } from "../guard.ts";

export function throwing<S>(r: Success<S>): S;
export function throwing<F>(r: Failure<F>): never;
export function throwing<S, F>(r: Result<S, F>): S;
export function throwing<S, F>(r: Result<S, F>): S {
  if (isFail(r)) throw getFail(r);
  return get(r);
}

export function throwingAsync<S>(r: Success<S>): Promise<Awaited<S>>;
export function throwingAsync<F>(r: Failure<F>): Promise<never>;
export function throwingAsync<S, F>(r: Result<S, F>): Promise<Awaited<S>>;
export function throwingAsync<S, F>(r: Result<S, F>): Promise<Awaited<S>> {
  if (isFail(r)) return Promise.reject(getFail(r));
  return Promise.resolve(get(r));
}
