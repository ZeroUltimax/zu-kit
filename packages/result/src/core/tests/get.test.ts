import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fail, res, succ } from "../factory.ts";
import { get, getChecked, getElse, getFail, getFailChecked, getOr } from "../get.ts";

describe("Result getters", () => {
  describe("Hard getters", () => {
    it("Gets the success", () => {
      const expected = 1;
      const r = succ(expected);
      const actual = get(r);
      assert.equal(actual, expected);
    });

    it("Gets the failure", () => {
      const expected = "1";
      const r = fail(expected);
      const actual = getFail(r);
      assert.equal(actual, expected);
    });
  });

  describe("Checked getters", () => {
    it("Gets the result success", () => {
      const expected = 1;
      const r = res<number, string>(expected, null);
      const actual = getChecked(r);

      assert.equal(actual, expected);
    });

    it("Throws when getting success of a failure", () => {
      const r = res<number, string>(null, "1");
      assert.throws(() => getChecked(r));
    });

    it("Gets the result failure", () => {
      const expected = "1";
      const r = res<number, string>(null, expected);
      const actual = getFailChecked(r);

      assert.equal(actual, expected);
    });

    it("Throws when getting failure of a success", () => {
      const r = res<number, string>(1, null);
      assert.throws(() => getFailChecked(r));
    });
  });

  describe("Defaulted Getters", () => {
    it(`Or gets the result when success`, () => {
      const expected = 1 as const;
      const r = succ(expected);
      const actual = getOr(r, 2) satisfies 1;

      assert.equal(actual, expected);
    });

    it(`Or gets the default when failure`, () => {
      const expected = 2 as const;
      const r = fail("1");
      const actual = getOr(r, expected) satisfies 2;

      assert.equal(actual, expected);
    });

    it(`Else gets the result when success`, () => {
      const expected = 1 as const;
      /* node:coverage ignore next */
      const neverCall = (): 2 => assert.fail("Expected to not call `neverCalled`");
      const r = succ(expected);
      const actual = getElse(r, neverCall) satisfies 1;

      assert.equal(actual, expected);
    });

    it(`Else gets the default when failure`, () => {
      const expected = 2 as const;
      const r = fail("1");
      const actual = getElse(r, (x: "1"): 2 => (+x * 2) as 2) satisfies 2;

      assert.equal(actual, expected);
    });
  });
});
