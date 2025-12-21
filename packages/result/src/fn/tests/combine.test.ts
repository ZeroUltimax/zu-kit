import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { and, andThen, type Failure, fail, or, orElse, type Result, res, type Success, succ } from "zu-res/fn";

describe("Functional Combine", () => {
  describe("and", () => {
    const r2 = res<2, "2">(2, null);
    const and2 = and(r2);

    it("returns first Failure", () => {
      const r1 = fail<"1">("1");
      const actual = and2(r1) satisfies Failure<"1">;
      assert.equal(actual, r1);
    });
    it("returns second Result if first is Success", () => {
      const r1 = succ<1>(1);
      const actual = and2(r1) satisfies Result<2, "2">;
      assert.equal(actual, r2);
    });
    it("Returns a mix of failures", () => {
      const r1 = res<1, "1">(1, null);
      const actual = and2(r1) satisfies Result<2, "1" | "2">;
      assert.equal(actual, r2);
    });
  });

  describe("or", () => {
    const r2 = res<2, "2">(2, null);
    const or2 = or(r2);
    it("returns first Success", () => {
      const r1 = succ<1>(1);
      const actual = or2(r1) satisfies Success<1>;
      assert.equal(actual, r1);
    });
    it("returns second Result if first is Failure", () => {
      const r1 = fail<"1">("1");
      const actual = or2(r1) satisfies Result<2, "2">;
      assert.equal(actual, r2);
    });
    it("Returns a mix of successes", () => {
      const r1 = res<1, "1">(1, null);
      const actual = or2(r1) satisfies Result<1 | 2, "2">;
      assert.equal(actual, r1);
    });
  });

  describe("andThen", () => {
    const andThenPlus1 = andThen((s: 1) => res<2, "2">((s + 1) as 2, null));
    const andThenNever = andThen(
      /* node:coverage ignore next */
      (_: number): Success<2> => assert.fail("Should not be called"),
    );

    it("returns first Failure", () => {
      const r1 = fail<"1">("1");
      const actual = andThenNever(r1) satisfies Failure<"1">;
      assert.equal(actual, r1);
    });
    it("returns result of function if first is Success", () => {
      const r1 = succ<1>(1);
      const actual = andThenPlus1(r1) satisfies Result<2, "2">;
      assert.deepEqual(actual, succ<2>(2));
    });
    it("returns a mix of failures", () => {
      const r1 = res<1, "1">(1, null);
      const actual = andThenPlus1(r1) satisfies Result<2, "1" | "2">;
      assert.deepEqual(actual, res<2, "2">(2, null));
    });
  });

  describe("orElse", () => {
    const orElsePlus1 = orElse((f: "1") => res<2, "2">((+f + 1) as 2, null));
    const orElseNever = orElse(
      /* node:coverage ignore next */
      (_: string): Success<2> => assert.fail("Should not be called"),
    );

    it("returns first Success", () => {
      const r1 = succ<1>(1);
      /* node:coverage ignore next */
      const actual = orElseNever(r1) satisfies Success<1>;
      assert.equal(actual, r1);
    });
    it("returns result of function if first is Failure", () => {
      const r1 = fail<"1">("1");
      const actual = orElsePlus1(r1) satisfies Result<2, "2">;
      assert.deepEqual(actual, succ<2>(2));
    });
    it("returns a mix of successes", () => {
      const r1 = res<1, "1">(1, null);
      const actual = orElsePlus1(r1) satisfies Result<1 | 2, "2">;
      assert.deepEqual(actual, res<1, "1">(1, null));
    });
  });
});
