import type { Failure, Result, Success } from "../type.ts";
import { isFail, isSucc } from "./guard.ts";

export function get<S>(rs: Success<S>): S {
  return rs.succ;
}

export function getFail<F>(rf: Failure<F>): NonNullable<F> {
  return rf.fail;
}

export function getChecked<S>(r: Result<S, unknown>): S {
  if (isFail(r)) throw new TypeError("r is ResultFail, expected ResultSucc");
  return get(r);
}

export function getFailChecked<F>(r: Result<unknown, F>): NonNullable<F> {
  if (isSucc(r)) throw new TypeError("r is ResultSucc, expected ResultFail");
  return getFail(r);
}

export function getOr<S>(r: Success<S>, def: unknown): S;
export function getOr<DS>(r: Failure<unknown>, def: DS): DS;
export function getOr<S, DS>(r: Result<S, unknown>, def: DS): S | DS;
export function getOr<S, DS>(r: Result<S, unknown>, def: DS): S | DS {
  if (isFail(r)) return def;
  return get(r);
}

export function getElse<S>(r: Success<S>, def: (f: unknown) => unknown): S;
export function getElse<F, DS>(r: Failure<F>, def: (f: F) => DS): DS;
export function getElse<S, F, DS>(r: Result<S, F>, def: (f: F) => DS): S | DS;
export function getElse<S, F, DS>(r: Result<S, F>, def: (f: F) => DS): S | DS {
  if (isFail(r)) return def(getFail(r));
  return get(r);
}
