import assert from "node:assert";
import { describe, it } from "node:test";

import type { Failure, Result, Success } from "../type.ts";
import { fail, res, succ } from "./factory.ts";
import { all } from "./transmute/array.ts";

describe("Array transmutation", () => {
  it("Collates an array of succceses into a success", () => {
    const _0 = succ<0>(0);
    const _1 = succ<1>(1);
    const _2 = succ<2>(2);

    const expected = succ([0, 1, 2]);
    const actual = all([_0, _1, _2]) satisfies Success<[0, 1, 2]>;

    assert.deepStrictEqual(actual, expected);
  });

  it("Returns the first failure in an array with a failure", () => {
    const _0 = succ<0>(0);
    const _1 = fail<"1">("1");
    const _2 = succ<2>(2);

    const expected = fail("1");
    const actual = all([_0, _1, _2]) satisfies Failure<"1">;

    assert.deepStrictEqual(actual, expected);
  });

  it("Returns a type union of possible failures", () => {
    const _0 = res<0, "0">(null, "0");
    const _1 = res<1, "1">(1, null);
    const _2 = res<2, "2">(2, null);

    const expected = fail("0");
    const actual = all([_0, _1, _2]) satisfies Result<[0, 1, 2], "0" | "1" | "2">;

    assert.deepStrictEqual(actual, expected);
  });

  it("Handles an empty array", () => {
    const expected = succ([]);
    const actual = all([]) satisfies Success<[]>;

    assert.deepStrictEqual(actual, expected);
  });

  it("Returns an explicit failure when at least one failure is explicit", () => {
    const _0 = succ<0>(0);
    const _1 = res<1, "1">(null, "1");
    const _2 = fail<"2">("2");

    const expected = fail("1");
    // TS doesn't know if _1 or _2 is the first failure, but is knows it's one of them
    const actual = all([_0, _1, _2]) satisfies Failure<"1" | "2">;

    assert.deepStrictEqual(actual, expected);
  });

  describe("Type tests", () => {
    it("all successes", () => {
      const s0 = succ<0>(0);
      const s1 = succ<1>(1);
      const s2 = succ<2>(2);

      type S0 = typeof s0;
      type S1 = typeof s1;
      type S2 = typeof s2;

      type Array = (S0 | S1 | S2)[];
      all<Array>([s0, s1, s2]) satisfies Success<(0 | 1 | 2)[]>;

      type ArrayRO = readonly (S0 | S1 | S2)[];
      all<ArrayRO>([s0, s1, s2]) satisfies Success<(0 | 1 | 2)[]>;

      type Tuple = [S0, S1, S2];
      all<Tuple>([s0, s1, s2]) satisfies Success<[0, 1, 2]>;

      type TupleRO = readonly [S0, S1, S2];
      all<TupleRO>([s0, s1, s2]) satisfies Success<[0, 1, 2]>;

      type MixedHead = [S0, ...(S1 | S2)[]];
      all<MixedHead>([s0, s1, s2]) satisfies Success<[0, ...(1 | 2)[]]>;

      type MixedHeadRO = readonly [S0, ...(S1 | S2)[]];
      all<MixedHeadRO>([s0, s1, s2]) satisfies Success<[0, ...(1 | 2)[]]>;

      type MixedTail = [...(S0 | S1)[], S2];
      all<MixedTail>([s0, s1, s2]) satisfies Success<[...(0 | 1)[], 2]>;

      type MixedTailRO = readonly [...(S0 | S1)[], S2];
      all<MixedTailRO>([s0, s1, s2]) satisfies Success<[...(0 | 1)[], 2]>;

      type MixedBoth = [S0, ...S1[], S2];
      all<MixedBoth>([s0, s1, s2]) satisfies Success<[0, ...1[], 2]>;

      type MixedBothRO = readonly [S0, ...S1[], S2];
      all<MixedBothRO>([s0, s1, s2]) satisfies Success<[0, ...1[], 2]>;
    });

    it("explicit failure", () => {
      const s0 = succ<0>(0);
      const f1 = fail<"1">("1");
      const s2 = succ<2>(2);
      const f3 = fail<"3">("3");

      type S0 = typeof s0;
      type F1 = typeof f1;
      type S2 = typeof s2;
      type F3 = typeof f3;

      type Array = (S0 | F1 | S2 | F3)[];
      all<Array>([s0, f1, s2, f3]) satisfies Result<(0 | 2)[], "1" | "3">;

      type ArrayRO = readonly (S0 | F1 | S2 | F3)[];
      all<ArrayRO>([s0, f1, s2, f3]) satisfies Result<(0 | 2)[], "1" | "3">;

      type Tuple = [S0, F1, S2, F3];
      all<Tuple>([s0, f1, s2, f3]) satisfies Failure<"1">;

      type TupleRO = readonly [S0, F1, S2, F3];
      all<TupleRO>([s0, f1, s2, f3]) satisfies Failure<"1">;

      type MixedHead = [S0, ...(F1 | S2 | F3)[]];
      all<MixedHead>([s0, f1, s2, f3]) satisfies Result<[0, ...2[]], "1" | "3">;

      type MixedHeadRO = readonly [S0, ...(F1 | S2 | F3)[]];
      all<MixedHeadRO>([s0, f1, s2, f3]) satisfies Result<[0, ...2[]], "1" | "3">;

      type MixedTail = [...(S0 | F1)[], S2, F3];
      all<MixedTail>([s0, f1, s2, f3]) satisfies Failure<"1" | "3">;

      type MixedTailRO = readonly [...(S0 | F1)[], S2, F3];
      all<MixedTailRO>([s0, f1, s2, f3]) satisfies Failure<"1" | "3">;

      type MixedBoth = [S0, ...F1[], S2, F3];
      all<MixedBoth>([s0, f1, s2, f3]) satisfies Failure<"1" | "3">;
    });

    it("mixed failure", () => {
      const s0 = succ<0>(0);
      const r1 = res<1, "1">(null, "1");
      const r2 = res<2, "2">(2, null);
      const f3 = fail<"3">("3");

      type S0 = typeof s0;
      type R1 = typeof r1;
      type R2 = typeof r2;
      type F3 = typeof f3;

      type Array = (S0 | R1 | R2 | F3)[];
      all<Array>([s0, r1, r2, f3]) satisfies Result<(0 | 1 | 2)[], "1" | "2" | "3">;

      type ArrayRO = readonly (S0 | R1 | R2 | F3)[];
      all<ArrayRO>([s0, r1, r2, f3]) satisfies Result<(0 | 1 | 2)[], "1" | "2" | "3">;

      type Tuple = [S0, R1, R2, F3];
      all<Tuple>([s0, r1, r2, f3]) satisfies Failure<"1" | "2" | "3">;

      type TupleRO = readonly [S0, R1, R2, F3];
      all<TupleRO>([s0, r1, r2, f3]) satisfies Failure<"1" | "2" | "3">;

      type MixedHead = [S0, ...(R1 | R2 | F3)[]];
      all<MixedHead>([s0, r1, r2, f3]) satisfies Result<[0, ...(1 | 2)[]], "1" | "2" | "3">;

      type MixedHeadRO = readonly [S0, ...(R1 | R2 | F3)[]];
      all<MixedHeadRO>([s0, r1, r2, f3]) satisfies Result<[0, ...(1 | 2)[]], "1" | "2" | "3">;

      type MixedTail = [...(S0 | R1)[], R2, F3];
      all<MixedTail>([s0, r1, r2, f3]) satisfies Failure<"1" | "2" | "3">;

      type MixedTailRO = readonly [...(S0 | R1)[], R2, F3];
      all<MixedTailRO>([s0, r1, r2, f3]) satisfies Failure<"1" | "2" | "3">;

      type MixedBoth = [S0, ...R1[], R2, F3];
      all<MixedBoth>([s0, r1, r2, f3]) satisfies Failure<"1" | "2" | "3">;
    });
  });
});
