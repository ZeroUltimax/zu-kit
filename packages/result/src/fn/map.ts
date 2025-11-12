import { map as _map, mapElse as _mapElse, mapFail as _mapFail, mapOr as _mapOr } from "../core/map.ts";
import type { Failure, Result, Success } from "../type.ts";

export const map =
  <S, T>(
    proj: (s: S) => T,
  ): {
    <_F>(r: Success<S>): Success<T>;
    <F>(r: Failure<F>): Failure<F>;
    <F>(r: Result<S, F>): Result<T, F>;
  } =>
  <F>(r: Result<S, F>) =>
    _map<S, F, T>(r, proj) as any;

export const mapFail =
  <F, G>(
    projFail: (s: F) => G,
  ): {
    <S>(r: Success<S>): Success<S>;
    (r: Failure<F>): Failure<G>;
    <S>(r: Result<S, F>): Result<S, G>;
  } =>
  <S>(r: Result<S, F>) =>
    _mapFail<S, F, G>(r, projFail) as any;

export const mapOr =
  <S, T, U>(
    proj: (s: S) => T,
    def: U,
  ): {
    (r: Success<S>): T;
    (r: Failure<unknown>): U;
    (r: Result<S, unknown>): T | U;
  } =>
  (r: Result<S, unknown>) =>
    _mapOr<S, T, U>(r, proj, def) as any;

export const mapElse =
  <S, F, T, G>(
    proj: (s: S) => T,
    projFail: (f: F) => G,
  ): {
    (r: Success<S>): T;
    (r: Failure<F>): G;
    (r: Result<S, F>): T | G;
  } =>
  (r: Result<S, F>) =>
    _mapElse<S, F, T, G>(r, proj, projFail) as any;
