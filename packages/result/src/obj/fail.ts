import { IterNever } from "../core/transmute/iter.ts";
import type { Failure } from "../type.ts";
import type { IRes } from "./interface.ts";
import type { Succ } from "./succ.ts";

export class Fail<F> implements IRes<never, F>, Failure<F> {
  public readonly fail: NonNullable<F>;

  constructor(fail: NonNullable<F>) {
    this.fail = fail;
  }

  // Guards
  public isSucc(): this is Succ<never> {
    return false;
  }
  public isFail(): this is Fail<F> {
    return true;
  }

  // Getters
  public getFail(): F {
    return this.fail;
  }
  public getChecked(): never {
    throw new TypeError("this is Failure, expected Success");
  }
  public getFailChecked(): NonNullable<F> {
    return this.fail;
  }
  public getOr<DS>(def: DS): DS {
    return def;
  }
  public getElse<DS>(defFn: (f: F) => DS): DS {
    return defFn(this.fail);
  }

  // Maps
  public map(_: unknown): this {
    return this;
  }
  public mapFail<G>(proj: (f: F) => NonNullable<G>): Fail<G> {
    return new Fail(proj(this.fail));
  }
  public mapOr<T, U>(_proj: (s: never) => T, def: U): U {
    return def;
  }
  public mapElse<T, G>(_proj: (s: never) => T, projFail: (f: F) => G): G {
    return projFail(this.fail);
  }

  // Combiners
  public and(_: unknown): this {
    return this;
  }
  public or<B extends IRes<unknown, unknown>>(b: B): B {
    return b;
  }
  public andThen(_: unknown): this {
    return this;
  }
  public orElse<B extends IRes<unknown, unknown>>(b: (f: F) => B): B {
    return b(this.fail);
  }

  // Transmuters
  public [Symbol.iterator](): Iterator<never> {
    return new IterNever();
  }
  public awaited(): Promise<this> {
    return Promise.resolve(this);
  }
  public throwing(): never {
    throw this.fail;
  }
  public throwingAsync(): Promise<never> {
    return Promise.reject(this.fail);
  }
}
