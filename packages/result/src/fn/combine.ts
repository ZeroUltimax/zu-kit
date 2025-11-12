import { and as _and, andThen as _andThen, or as _or, orElse as _orElse } from "../core/combine.ts";
import type { Failure, Result, Success } from "../type.ts";

export const and =
  <B extends Result<unknown, unknown>>(
    b: B,
  ): {
    <F>(a: Failure<F>): Failure<F>;
    (a: Success<unknown>): B;
    <F>(a: Result<unknown, F>): Failure<F> | B;
  } =>
  <F>(a: Result<unknown, F>) =>
    _and<F, B>(a, b) as any;

export const or =
  <B extends Result<unknown, unknown>>(
    b: B,
  ): {
    <S>(a: Success<S>): Success<S>;
    (a: Failure<unknown>): B;
    <S>(a: Result<S, unknown>): Success<S> | B;
  } =>
  <S>(a: Result<S, unknown>) =>
    _or<S, B>(a, b) as any;

export const andThen =
  <S, B extends Result<unknown, unknown>>(
    b: (s: S) => B,
  ): {
    <F>(a: Failure<F>): Failure<F>;
    (a: Success<S>): B;
    <F>(a: Result<S, F>): Failure<F> | B;
  } =>
  <F>(a: Result<S, F>) =>
    _andThen<S, F, B>(a, b) as any;

export const orElse =
  <F, B extends Result<unknown, unknown>>(
    b: (f: F) => B,
  ): {
    <S>(a: Success<S>): Success<S>;
    (a: Failure<F>): B;
    <S>(a: Result<S, F>): Success<S> | B;
  } =>
  <S>(a: Result<S, F>) =>
    _orElse<S, F, B>(a, b) as any;
