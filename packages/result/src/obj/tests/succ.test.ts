import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type IRes, Succ } from "zu-res/obj";

const r = new Succ<1>(1);
const r2 = new Succ(2) as Res<2, "2">;

describe("Obj Success", () => {
  describe("Guard", () => {
    it("Success is a success", () => {
      const actual = r.isSucc();
      assert(actual);
    });

    it("Success is a not a failure", () => {
      const actual = r.isFail();
      assert(!actual);
    });
  });
  describe("Get", () => {
    it("Gets the success", () => {
      const expected = 1;
      const actual = r.get();
      assert.equal(actual, expected);
    });

    it("Gets the success checked", () => {
      const expected = 1;
      const actual = r.getChecked();

      assert.equal(actual, expected);
    });

    it("Throws when getting failure of a success", () => {
      assert.throws(() => r.getFailChecked());
    });

    it(`Or gets the result when success`, () => {
      const expected = 1;
      const actual = r.getOr(2) satisfies 1;
      assert.equal(actual, expected);
    });

    it(`Else gets the result when success`, () => {
      const expected = 1 as const;
      /* node:coverage ignore next */
      const neverCall = (): 2 => assert.fail("Expected to not call `neverCalled`");
      const actual = r.getElse(neverCall) satisfies 1;

      assert.equal(actual, expected);
    });
  });
  describe("Map", () => {
    const twiceNum = (x: 1): 2 => (x * 2) as 2;

    /* node:coverage ignore next */
    const neverString = (_s: string): string => assert.fail("Should not be called");

    it("maps Success value", () => {
      const expected = new Succ(2);
      const actual = r.map(twiceNum) satisfies Succ<2>;
      assert.deepEqual(actual, expected);
    });

    it("does not fail map Success value", () => {
      const expected = r;
      const actual = r.mapFail(neverString) satisfies Succ<1>;
      assert.equal(actual, expected);
    });

    it("or maps Success value", () => {
      const expected = 2;
      const actual = r.mapOr(twiceNum, true) satisfies 2;
      assert.equal(actual, expected);
    });

    it("else maps Success value", () => {
      const expected = 2;
      const actual = r.mapElse(twiceNum, neverString) satisfies 2;
      assert.equal(actual, expected);
    });
  });
  describe("Combine", () => {
    const thenPlus1 = (s: 1): Res<2, "2"> => new Succ((s + 1) as 2);
    /* node:coverage ignore next */
    const neverCall = (_: number): Succ<2> => assert.fail("Expected to not call `neverCall`");

    it("and returns second Res", () => {
      const actual = r.and(r2) satisfies Res<2, "2">;
      assert.equal(actual, r2);
    });

    it("or returns this", () => {
      const actual = r.or(r2) satisfies Succ<1>;
      assert.equal(actual, r);
    });

    it("and then returns result of function", () => {
      const expected = new Succ<2>(2);
      const actual = r.andThen(thenPlus1) satisfies Res<2, "2">;
      assert.deepEqual(actual, expected);
    });

    it("or else returns first Success", () => {
      const actual = r.orElse(neverCall) satisfies Succ<1>;
      assert.equal(actual, r);
    });
  });
  describe("Transmute", () => {
    it("Iterates the value once", () => {
      const v = [...r];
      assert.deepStrictEqual(v, [1]);
    });
    it("Awaits the success promise", async () => {
      const v = new Promise<1>((r) => r(1 as const));
      const rp = new Succ(v);
      const expected = new Succ(1);
      const actual = (await rp.awaited()) satisfies Succ<1>;
      assert.deepStrictEqual(actual, expected);
    });
    it("Awaits the success promise deeply", async () => {
      const v = new Promise<Promise<1>>((r) => r(new Promise<1>((r) => r(1 as const))));
      const rp = new Succ(v);
      const expected = new Succ(1);
      const actual = (await rp.awaited()) satisfies Succ<1>;
      assert.deepStrictEqual(actual, expected);
    });
    it("throwing returns the success value", () => {
      const expected = 1;
      const actual = r.throwing();
      assert.equal(actual, expected);
    });
    it("throwing async returns the success value async", async () => {
      const expected = 1;
      const actual = await r.throwingAsync();
      assert.equal(actual, expected);
    });
  });
});
