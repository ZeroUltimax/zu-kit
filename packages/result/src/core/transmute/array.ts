import type { Failure, Result, Success } from "../../type.ts";
import { succ } from "../factory.ts";
import { get } from "../get.ts";
import { isFail } from "../guard.ts";

// Without the added `[]` type, fn([]) would infer the array to be type never[] which complicates the logic
type ResultArray = readonly Result<unknown, unknown>[] | [];

/*
  I use of [X] extends [Y] is to avoid the distribution over X when X is a generic parameter
  Result<A,B> extends ResultSucc<unknown> ? "yes" : "no"
    -> yields "yes" | "no", since it distributes over ResultSucc<A> | ResultFail<B>
  [Result<A,B>] extends [ResultSucc<unknown>] ? "yes" : "no"
    -> yields "no"
  never extends unknown  ? "yes" : "no"
    -> yields never, since it distributes over the empty set.
*/

// biome-ignore format: Readability
export type All<RS extends ResultArray> =
  RS extends readonly [infer H, ...infer T extends ResultArray] ? ConcatRes<MonoTupleResult<H>, All<T>>
: RS extends readonly [...infer I extends ResultArray, infer L] ? ConcatRes<All<I>, MonoTupleResult<L>>
: RS extends readonly [] ? Success<[]>
: RS extends readonly Success<infer S>[] ? Success<S[]>
: RS extends readonly Failure<infer F>[] ? Failure<F>
: RS extends readonly Result<infer S, infer F>[] ? Result<S[], F>
: never;

// biome-ignore format: Readability
type MonoTupleResult<R> =
  [R] extends [Failure<infer F>]      ? Failure<F>
: [R] extends [Success<infer S>]      ? Success<[S]>
: [R] extends [Result<infer S, infer F>] ? Result<[S],F>
: never;

type ConcatRes<A, B> = [A] extends [Failure<unknown>]
  ? A // In case of explicit failure, we know to return it
  : ResultUnion<ConcatSucc<A, B> | ConcatFail<A, B>>;

type ConcatSucc<A, B> = A extends Success<infer S extends unknown[]>
  ? B extends Success<infer F extends unknown[]>
    ? Success<[...S, ...F]>
    : never
  : never;

type ConcatFail<A, B> = Extract<A | B, Failure<unknown>>;

// biome-ignore format: Readability
// Create a nice Result type with all successes united and and failures united
type ResultUnion<R> =
  [R] extends [never] ? never // This annoying case prevents `[never] extends [Result<unknown,unknown>]`
: [R] extends [Success<infer S>] ? Success<S>  
: [R] extends [Failure<infer F>] ? Failure<F>
: [R] extends [Result<infer S, infer F>] ? Result<S, F>
: never;

// This "fail-first" approach is slower than optimistically assuming no failures,
// but in failure cases it's much faster, since we're not pre-allocating an array we won't use.
export function all<const RS extends ResultArray>(rs: RS): All<RS> {
  for (let i = 0; i < rs.length; i++) {
    const r = rs[i]!;
    if (isFail(r)) return r as any;
  }
  const succs: unknown[] = new Array(rs.length);
  for (let i = 0; i < rs.length; i++) {
    const r = rs[i]! as Success<unknown>;
    succs[i] = get(r);
  }
  return succ(succs) as any;
}
