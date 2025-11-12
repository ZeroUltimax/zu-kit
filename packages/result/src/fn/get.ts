import { getElse as _getElse, getOr as _getOr } from "../core/get.ts";
import type { Failure, Result, Success } from "../type.ts";

export { get, getChecked, getFail, getFailChecked } from "../core/get.ts";

export const getOr =
  <DS>(
    def: DS,
  ): {
    <S>(r: Success<S>): S;
    (r: Failure<unknown>): DS;
    <S>(r: Result<S, unknown>): S | DS;
  } =>
  <S>(r: Result<S, unknown>): S | DS =>
    _getOr(r, def);

export const getElse =
  <F, DS>(
    def: (f: F) => DS,
  ): {
    <S>(r: Success<S>): S;
    (r: Failure<F>): DS;
    <S>(r: Result<S, F>): S | DS;
  } =>
  <S>(r: Result<S, F>) =>
    _getElse(r, def);
