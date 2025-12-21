import { IterOnce } from "../core/transmute/iter.ts";
import type { Success } from "../type.ts";
import type { Fail } from "./fail.ts";
import type { IRes } from "./interface.ts";

export class Succ<S> implements IRes<S, never>, Success<S> {
  public readonly succ: S;
  public readonly fail: null = null;

  constructor(succ: S) {
    this.succ = succ;
  }

  // Guards
  public isSucc(): this is Succ<S> {
    return true;
  }
  public isFail(): this is Fail<never> {
    return false;
  }

  // Getters
  public get(): S {
    return this.succ;
  }
  public getChecked(): S {
    return this.succ;
  }
  public getFailChecked(): never {
    throw new TypeError("this is Success, expected Failure");
  }
  public getOr(_def: unknown): S {
    return this.succ;
  }
  public getElse(_defFn: (f: never) => unknown): S {
    return this.succ;
  }

  // Maps
  public map<T>(proj: (s: S) => T): Succ<T> {
    return new Succ(proj(this.succ));
  }
  public mapFail(_: unknown): this {
    return this;
  }
  public mapOr<T>(proj: (s: S) => T, _: unknown): T {
    return proj(this.succ);
  }
  public mapElse<T>(proj: (s: S) => T, _: unknown): T {
    return proj(this.succ);
  }

  // Combiners
  public and<B extends IRes<unknown, unknown>>(b: B): B {
    return b;
  }
  public or(_: unknown): this {
    return this;
  }
  public andThen<B extends IRes<unknown, unknown>>(b: (s: S) => B): B {
    return b(this.succ);
  }

  public orElse(_: unknown): this {
    return this;
  }

  // Transmuters
  public [Symbol.iterator](): Iterator<S> {
    return new IterOnce(this.succ);
  }
  public awaited(): Promise<Succ<Awaited<S>>> {
    return Promise.resolve(this.succ).then((succ) => new Succ(succ));
  }
  public throwing(): S {
    return this.succ;
  }
  public throwingAsync(): Promise<Awaited<S>> {
    return Promise.resolve(this.succ);
  }
}
