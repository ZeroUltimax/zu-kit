import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type Failure, fail, failChecked, res, type Success, succ } from "zu-res";

describe("Result factories", () => {
  describe("Hard Results", () => {
    it("Creates a success", () => {
      const expected = { succ: 1 };
      const actual = succ(1) satisfies Success<number>;

      assert.partialDeepStrictEqual(actual, expected);
    });

    it("Creates a failure", () => {
      const expected = { fail: "1" };
      const actual = fail("1") satisfies Failure<string>;

      assert.partialDeepStrictEqual(actual, expected);
    });
  });

  describe("Checked Results", () => {
    it("Creates a checked failure", () => {
      const expected = { fail: "1" };
      const actual = failChecked("1") satisfies Failure<string>;

      assert.partialDeepStrictEqual(actual, expected);
    });

    it("Fails to create a failure of nullable", () => {
      assert.throws(() => failChecked(null));
      assert.throws(() => failChecked(undefined));
    });
  });

  describe("Soft results", () => {
    it("Creates a success result", () => {
      const succ = 1;
      const fail = null;

      const expected = { succ: 1 };
      const actual = res(succ, fail) satisfies Success<number>;

      assert.partialDeepStrictEqual(actual, expected);
    });

    it("Creates a failure result", () => {
      const succ = null;
      const fail = "1";

      const expected = { fail: "1" };
      const actual = res(succ, fail) satisfies Failure<string>;

      assert.partialDeepStrictEqual(actual, expected);
    });

    it("Creates an unknown result", () => {
      const succ = 1 as number | null;
      const fail = null as string | null;

      const expected = { succ: 1 };
      const actual = res(succ, fail);

      // @ts-expect-error Cannot determine success or failure
      const _isSucc = actual satisfies Success<number>;
      // @ts-expect-error Cannot determine success or failure
      const _isFail = actual satisfies Failure<string>;

      assert.partialDeepStrictEqual(actual, expected);
    });
  });
});
