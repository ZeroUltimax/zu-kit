import type { Failure, Result, Success } from "../type.ts";
import { fail, succ } from "./factory.ts";
import { get, getFail } from "./get.ts";
import { isFail, isSucc } from "./guard.ts";

export function map<S, T>(r: Success<S>, proj: (s: S) => T): Success<T>;
export function map<_S, F>(r: Failure<F>, proj: (s: _S) => unknown): Failure<F>;
export function map<S, F, T>(r: Result<S, F>, proj: (s: S) => T): Result<T, F>;
export function map<S, F, T>(r: Result<S, F>, proj: (s: S) => T): Result<T, F> {
  if (isFail(r)) return r;
  return succ(proj(get(r)));
}

export function mapFail<S, _F>(r: Success<S>, projFail: (f: _F) => unknown): Success<S>;
export function mapFail<F, G>(r: Failure<F>, projFail: (f: F) => NonNullable<G>): Failure<G>;
export function mapFail<S, F, G>(r: Result<S, F>, projFail: (f: F) => NonNullable<G>): Result<S, G>;
export function mapFail<S, F, G>(r: Result<S, F>, projFail: (f: F) => NonNullable<G>): Result<S, G> {
  if (isSucc(r)) return r;
  return fail(projFail(getFail(r)));
}

export function mapOr<S, T>(r: Success<S>, proj: (s: S) => T, def: unknown): T;
export function mapOr<_S, U>(r: Failure<unknown>, proj: (s: _S) => unknown, def: U): U;
export function mapOr<S, T, U>(r: Result<S, unknown>, proj: (s: S) => T, def: U): T | U;
export function mapOr<S, T, U>(r: Result<S, unknown>, proj: (s: S) => T, def: U): T | U {
  if (isFail(r)) return def;
  return proj(get(r));
}

export function mapElse<S, _F, T>(r: Success<S>, proj: (s: S) => T, projFail: (f: _F) => unknown): T;
export function mapElse<_S, F, G>(r: Failure<F>, proj: (s: _S) => unknown, projFail: (f: F) => G): G;
export function mapElse<S, F, T, G>(r: Result<S, F>, proj: (s: S) => T, projFail: (f: F) => G): T | G;
export function mapElse<S, F, T, G>(r: Result<S, F>, proj: (s: S) => T, projFail: (f: F) => G): T | G {
  if (isFail(r)) return projFail(getFail(r));
  return proj(get(r));
}
