import type { Result } from "../../type.ts";
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

export function iter<S, F>(r: Result<S, F>): Iterable<S> {
  if (isFail(r)) return new IterNever();
  return new IterOnce(get(r));
}
