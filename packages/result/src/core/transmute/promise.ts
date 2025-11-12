import type { Failure, Result, Success } from "../../type.ts";
import { succ } from "../factory.ts";
import { get } from "../get.ts";
import { isFail } from "../guard.ts";

export function awaited<S>(r: Success<Promise<S>>): Promise<Success<Awaited<S>>>;
export function awaited<F>(r: Failure<F>): Promise<Failure<F>>;
export function awaited<S, F>(r: Result<Promise<S>, F>): Promise<Result<Awaited<S>, F>>;
export function awaited<S, F>(r: Result<Promise<S>, F>): Promise<Result<Awaited<S>, F>> {
  if (isFail(r)) return Promise.resolve(r);
  return Promise.resolve(get(r)).then(succ);
}
