import type { Result } from "../../type.ts";
import { fail, succ } from "../factory.ts";

export function trying<S, F = unknown>(fn: () => S): Result<S, F> {
  try {
    return succ(fn());
  } catch (e) {
    if (e == null) throw new TypeError("Expected non nullable error.");
    return fail(e as NonNullable<F>);
  }
}

export function tryify<A extends unknown[], R, F = unknown>(fn: (...args: A) => R): (...args: A) => Result<R, F> {
  return (...args) => trying(() => fn(...args));
}
