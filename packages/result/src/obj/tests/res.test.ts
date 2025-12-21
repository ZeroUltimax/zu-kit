import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { all, Fail, fail, failChecked, fromResult, type IRes, res, resultify, resulting, Succ, succ } from "zu-res/obj";

describe("Obj Utilities", () => {
  describe("Factory", () => {
    describe("Hard Results", () => {
      it("Creates a success", () => {
        const expected = new Succ(1);
        const actual = succ(1) satisfies Succ<number>;
        assert.deepStrictEqual(actual, expected);
      });

      it("Creates a failure", () => {
        const expected = new Fail("1");
        const actual = fail("1") satisfies Fail<"1">;

        assert.deepStrictEqual(actual, expected);
      });
    });

    describe("Checked Results", () => {
      it("Creates a checked failure", () => {
        const expected = new Fail("1");
        const actual = failChecked("1") satisfies Fail<"1">;

        assert.deepStrictEqual(actual, expected);
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

        const expected = new Succ(1);
        const actual = res(succ, fail) satisfies Succ<1>;

        assert.deepStrictEqual(actual, expected);
      });

      it("Creates a failure result", () => {
        const succ = null;
        const fail = "1";

        const expected = new Fail("1");
        const actual = res(succ, fail) satisfies Fail<"1">;

        assert.deepStrictEqual(actual, expected);
      });

      it("Creates an unknown result", () => {
        const succ = 1 as number | null;
        const fail = null as string | null;

        const expected = new Succ(1);
        const actual = res(succ, fail);

        // @ts-expect-error Cannot determine success or failure
        const _isSucc = actual satisfies Succ<number>;
        // @ts-expect-error Cannot determine success or failure
        const _isFail = actual satisfies Fail<string>;

        assert.deepStrictEqual(actual, expected);
      });
    });
  });
  describe("Transmute", () => {
    describe("convert", () => {
      it("Creates a success obj", () => {
        const r = succ<1>(1);
        const expected = new Succ<1>(1);
        const actual = fromResult(r) satisfies Succ<1>;
        assert.deepStrictEqual(actual, expected);
      });
      it("Creates a failure obj", () => {
        const r = fail<"1">("1");
        const expected = new Fail<"1">("1");
        const actual = fromResult(r) satisfies Fail<"1">;
        assert.deepStrictEqual(actual, expected);
      });
      it("Creates an unknown obj", () => {
        const r = res<number, string>(1, null);
        const expected = new Succ<number>(1);
        const actual = fromResult(r);

        // @ts-expect-error Cannot determine success or failure
        const _isSucc = actual satisfies Succ<number>;
        // @ts-expect-error Cannot determine success or failure
        const _isFail = actual satisfies Fail<string>;

        assert.deepStrictEqual(actual, expected);
      });
    });
    describe("array", () => {
      it("Collates an array of succceses into a success", () => {
        const _0 = new Succ<0>(0);
        const _1 = new Succ<1>(1);
        const _2 = new Succ<2>(2);

        const expected = new Succ([0, 1, 2]);
        const actual = all([_0, _1, _2]) satisfies Succ<[0, 1, 2]>;

        assert.deepStrictEqual(actual, expected);
      });

      it("Returns the first failure in an array with a failure", () => {
        const _0 = new Succ<0>(0);
        const _1 = new Fail<"1">("1");
        const _2 = new Succ<2>(2);

        const expected = new Fail("1");
        const actual = all([_0, _1, _2]) satisfies Fail<"1">;

        assert.deepStrictEqual(actual, expected);
      });

      it("Handles an empty array", () => {
        const expected = new Succ([]);
        const actual = all([]) satisfies Succ<[]>;

        assert.deepStrictEqual(actual, expected);
      });
    });
    describe("trying", () => {
      function add(a: 1, b: 2): 3 {
        return (a + b) as 3;
      }
      function throwMultiply(a: 4, b: 5): 6 {
        throw (a * b) as 20;
      }
      it("Wraps the return value in success", () => {
        const expected = new Succ(3);
        const actual = trying(() => add(1, 2)) satisfies Res<3, unknown>;
        assert.deepStrictEqual(actual, expected);
      });

      it("Wraps the thrown error in failure", () => {
        const expected = new Fail(20);
        const actual = trying(() => throwMultiply(4, 5)) satisfies Res<6, unknown>;
        assert.deepStrictEqual(actual, expected);
      });

      it("tryifies a successful function", () => {
        const tryAdd = tryify(add) satisfies (a: 1, b: 2) => Res<3, unknown>;
        const expected = new Succ(3);
        const actual = tryAdd(1, 2);
        assert.deepStrictEqual(actual, expected);
      });

      it("tryifies a throwing function", () => {
        const tryThrowMultiply = tryify(throwMultiply) satisfies (a: 4, b: 5) => Res<6, unknown>;
        const expected = new Fail(20);
        const actual = tryThrowMultiply(4, 5);
        assert.deepStrictEqual(actual, expected);
      });

      it("Throws TypeError on nullish error", () => {
        assert.throws(
          tryify(() => {
            throw null;
          }),
          TypeError,
        );
      });
    });
  });
});
