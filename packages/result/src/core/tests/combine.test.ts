import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { and, andThen, type Failure, fail, or, orElse, type Result, res, type Success, succ } from "zu-res";

describe("Result Combiners", () => {
  describe("and", () => {
    it("returns first Failure", () => {
      const r1 = fail<"1">("1");
      const r2 = succ<2>(2);
      const actual = and(r1, r2) satisfies Failure<"1">;
      assert.equal(actual, r1);
    });
    it("returns second Result if first is Success", () => {
      const r1 = succ<1>(1);
      const r2 = res<2, "2">(2, null);
      const actual = and(r1, r2) satisfies Result<2 | null, "2">;
      assert.equal(actual, r2);
    });
    it("Returns a mix of failures", () => {
      const r1 = res<1, "1">(1, null);
      const r2 = res<2, "2">(2, null);
      const actual = and(r1, r2) satisfies Result<2 | null, "1" | "2">;
      assert.equal(actual, r2);
    });
  });

  describe("or", () => {
    it("returns first Success", () => {
      const r1 = succ<1>(1);
      const r2 = fail<"2">("2");
      const actual = or(r1, r2) satisfies Success<1>;
      assert.equal(actual, r1);
    });
    it("returns second Result if first is Failure", () => {
      const r1 = fail<"1">("1");
      const r2 = res<2, "2">(2, null);
      const actual = or(r1, r2) satisfies Result<2 | null, "2">;
      assert.equal(actual, r2);
    });
    it("Returns a mix of successes", () => {
      const r1 = res<1, "1">(1, null);
      const r2 = res<2, "2">(2, null);
      const actual = or(r1, r2) satisfies Result<1 | 2 | null, "2">;
      assert.equal(actual, r1);
    });
  });

  describe("andThen", () => {
    const thenPlus1 = (s: 1 | null) => res<2, "2">(((s as 1) + 1) as 2, null);
    /* node:coverage ignore next */
    const thenNever = (_: number): Success<2> => assert.fail("Expected to not call `thenNever`");

    it("returns first Failure", () => {
      const r1 = fail<"1">("1");
      const actual = andThen(r1, thenNever) satisfies Failure<"1">;
      assert.equal(actual, r1);
    });
    it("returns result of function if first is Success", () => {
      const r1 = succ<1>(1);
      const actual = andThen(r1, thenPlus1) satisfies Result<2 | null, "2">;
      assert.deepEqual(actual, succ<2>(2));
    });
    it("returns a mix of failures", () => {
      const r1 = res<1, "1">(1, null);
      const actual = andThen(r1, thenPlus1) satisfies Result<2 | null, "1" | "2">;
      assert.deepEqual(actual, res<2, "2">(2, null));
    });
  });

  describe("orElse", () => {
    const elsePlus1 = (f: "1") => res<2, "2">((+f + 1) as 2, null);
    /* node:coverage ignore next */
    const elseNever = (_: string): Success<2> => assert.fail("Expected to not call `elseNever`");
    it("returns first Success", () => {
      const r1 = succ<1>(1);
      const actual = orElse(r1, elseNever) satisfies Success<1>;
      assert.equal(actual, r1);
    });
    it("returns result of function if first is Failure", () => {
      const r1 = fail<"1">("1");
      const actual = orElse(r1, elsePlus1) satisfies Result<2 | null, "2">;
      assert.deepEqual(actual, succ<2>(2));
    });
    it("returns a mix of successes", () => {
      const r1 = res<1, "1">(1, null);
      const actual = orElse(r1, elsePlus1) satisfies Result<1 | 2 | null, "2">;
      assert.deepEqual(actual, res<1, "1">(1, null));
    });
  });
});
