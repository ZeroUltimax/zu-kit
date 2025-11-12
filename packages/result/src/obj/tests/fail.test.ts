import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Fail } from "../fail.ts";
import type { Res } from "./res.ts";

const r = new Fail<"1">("1");
const r2 = new Fail<"2">("2") as Res<2, "2">;

describe("Obj Failure", () => {
  describe("Guard", () => {
    it("Failure is not a success", () => {
      const actual = r.isSucc();
      assert(!actual);
    });

    it("Failure is a failure", () => {
      const actual = r.isFail();
      assert(actual);
    });
  });
  describe("Get", () => {
    it("Gets the failure", () => {
      const expected = "1";
      const actual = r.getFail();
      assert.equal(actual, expected);
    });

    it("Throws when getting success of a failure", () => {
      assert.throws(() => r.getChecked());
    });

    it("Gets failure checked", () => {
      const expected = "1";
      const actual = r.getFailChecked();
      assert.equal(actual, expected);
    });

    it(`Or gets the default when failure`, () => {
      const expected = 2 as const;
      const actual = r.getOr(expected) satisfies 2;
      assert.equal(actual, expected);
    });

    it(`Else gets the default when failure`, () => {
      const expected = 2 as const;
      const actual = r.getElse((x: "1"): 2 => (+x * 2) as 2) satisfies 2;
      assert.equal(actual, expected);
    });
  });
  describe("Map", () => {
    const twiceString = (s: "1"): "11" => (s + s) as "11";

    /* node:coverage ignore next */
    const neverNum = (_x: number): number => assert.fail("Should not be called");

    it("does not map Failure value", () => {
      const expected = r;
      const actual = r.map(neverNum) satisfies Fail<"1">;
      assert.equal(actual, expected);
    });

    it("maps Failure value", () => {
      const expected = new Fail("11");
      const actual = r.mapFail(twiceString) satisfies Fail<"11">;
      assert.deepEqual(actual, expected);
    });

    it("or map returns default for Failure", () => {
      const expected = true;
      const actual = r.mapOr(neverNum, true) satisfies boolean;
      assert.equal(actual, expected);
    });

    it("else maps Failure value with projFail", () => {
      const expected = "11";
      const actual = r.mapElse(neverNum, twiceString) satisfies "11";
      assert.equal(actual, expected);
    });
  });
  describe("Combine", () => {
    const elsePlus1 = (f: "1"): Res<2, "2"> => new Fail(`${+f + 1}` as "2");

    /* node:coverage ignore next */
    const neverCall = (_: string): Fail<"2"> => assert.fail("Expected to not call `neverCall`");

    it("and returns this", () => {
      const actual = r.and(r2) satisfies Fail<"1">;
      assert.equal(actual, r);
    });

    it("or returns second Result", () => {
      const actual = r.or(r2) satisfies Res<2, "2">;
      assert.equal(actual, r2);
    });

    it("and then returns this", () => {
      const actual = r.andThen(neverCall) satisfies Fail<"1">;
      assert.equal(actual, r);
    });

    it("or else returns result of function", () => {
      const expected = new Fail("2");
      const actual = r.orElse(elsePlus1) satisfies Res<2, "2">;
      assert.deepEqual(actual, expected);
    });
  });
  describe("Transmute", () => {
    it("Iterates nothing", () => {
      const v = [...r];
      assert.deepStrictEqual(v, []);
    });
    it("Awaited passes through failure unchanged", async () => {
      const expected = r;
      const actual = await r.awaited();
      assert.equal(actual, expected);
    });
    it("Throws the failure", () => {
      const expected = "1";
      assert.throws(
        () => r.throwing(),
        (e) => {
          assert.equal(e, expected);
          return true;
        },
      );
    });
    it("Throws the failure async", async () => {
      const expected = "1";
      await assert.rejects(
        () => r.throwingAsync(),
        (e) => {
          assert.equal(e, expected);
          return true;
        },
      );
    });
  });
});
