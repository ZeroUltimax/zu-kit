import type { Failure, Result, Success } from "../../type.ts";
import { get } from "../get.ts";
import { isFail } from "../guard.ts";

export class IterNever implements IterableIterator<never> {
  next(): IteratorResult<never> {
    return {
      done: true,
      value: null,
    };
  }

  [Symbol.iterator](): this {
    return this;
  }
}

export class IterOnce<T> implements IterableIterator<T> {
  private done = false;
  private t: T;
  constructor(t: T) {
    this.t = t;
  }

  next(): IteratorResult<T> {
    if (!this.done) {
      this.done = true;
      return {
        done: false,
        value: this.t,
      };
    }

    return {
      done: true,
      value: null,
    };
  }

  [Symbol.iterator](): this {
    return this;
  }
}

export function iter<S>(r: Success<S>): Iterable<S>;
export function iter(r: Failure<unknown>): Iterable<never>;
export function iter<S>(r: Result<S, unknown>): Iterable<S>;
export function iter<S>(r: Result<S, unknown>): Iterable<S> {
  if (isFail(r)) return new IterNever();
  return new IterOnce(get(r));
}
