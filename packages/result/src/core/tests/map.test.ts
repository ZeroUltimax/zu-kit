import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fail, succ } from "../factory.ts";
import { map, mapElse, mapFail, mapOr } from "../map.ts";
import type { Failure, Success } from "../type.ts";

const twiceNum = (x: number) => x * 2;
const twiceString = (s: string) => s + s;

/* node:coverage disable */
const neverNum = (_x: number): number => assert.fail("Should not be called");
const neverString = (_s: string): string => assert.fail("Should not be called");
/* node:coverage enable */

describe("Result Map", () => {
  describe("Success Map", () => {
    it("maps Success value", () => {
      const r = succ(1);
      const expected = succ(2);
      const actual = map(r, twiceNum) satisfies Success<number>;
      assert.deepEqual(actual, expected);
    });
    it("does not map Failure value", () => {
      const r = fail("1");
      const expected = r;
      const actual = map(r, neverNum) satisfies Failure<string>;
      assert.equal(actual, expected);
    });
  });

  describe("mapFail", () => {
    it("does not map Success value", () => {
      const r = succ(1);
      const expected = r;
      const actual = mapFail(r, neverString) satisfies Success<number>;
      assert.equal(actual, expected);
    });
    it("maps Failure value", () => {
      const r = fail("1");
      const expected = fail("11");
      const actual = mapFail(r, twiceString) satisfies Failure<string>;
      assert.deepEqual(actual, expected);
    });
  });

  describe("mapOr", () => {
    it("maps Success value", () => {
      const r = succ(1);
      const expected = 2;
      const actual = mapOr(r, twiceNum, true) satisfies number;
      assert.equal(actual, expected);
    });
    it("returns default for Failure", () => {
      const r = fail("1");
      const expected = true;
      const actual = mapOr(r, twiceNum, true) satisfies boolean;
      assert.equal(actual, expected);
    });
  });

  describe("mapElse", () => {
    it("maps Success value", () => {
      const r = succ(1);
      const expected = 2;
      const actual = mapElse(r, twiceNum, neverString) satisfies number;
      assert.equal(actual, expected);
    });
    it("maps Failure value with projFail", () => {
      const r = fail("1");
      const expected = "11";
      const actual = mapElse(r, neverNum, twiceString) satisfies string;
      assert.equal(actual, expected);
    });
  });
});
