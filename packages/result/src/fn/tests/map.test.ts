import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { map, mapElse, mapFail, mapOr } from "../map.ts";
import type { Failure, Success } from "../type.ts";
import { fail, succ } from "./factory.ts";

const twiceNum = (x: number) => x * 2;
const twiceString = (s: string) => s + s;

/* node:coverage disable */
const neverNum = (_x: number): number => assert.fail("Should not be called");
const neverString = (_s: string): string => assert.fail("Should not be called");
/* node:coverage enable */

describe("Functional Map", () => {
  describe("Success Map", () => {
    const mapTwice = map(twiceNum);
    const mapNever = map(neverNum);

    it("maps Success value", () => {
      const r = succ(1);
      const expected = succ(2);
      const actual = mapTwice(r) satisfies Success<number>;
      assert.deepEqual(actual, expected);
    });
    it("does not map Failure value", () => {
      const r = fail("1");
      const expected = r;
      const actual = mapNever(r) satisfies Failure<string>;
      assert.equal(actual, expected);
    });
  });

  describe("mapFail", () => {
    const mapTwice = mapFail(twiceString);
    const mapNever = mapFail(neverString);
    it("does not map Success value", () => {
      const r = succ(1);
      const expected = r;
      const actual = mapNever(r) satisfies Success<number>;
      assert.equal(actual, expected);
    });
    it("maps Failure value", () => {
      const r = fail("1");
      const expected = fail("11");
      const actual = mapTwice(r) satisfies Failure<string>;
      assert.deepEqual(actual, expected);
    });
  });

  describe("mapOr", () => {
    const mapTwiceOrTrue = mapOr(twiceNum, true);
    const mapNeverOrTrue = mapOr(neverNum, true);

    it("maps Success value", () => {
      const r = succ(1);
      const expected = 2;
      const actual = mapTwiceOrTrue(r) satisfies number;
      assert.equal(actual, expected);
    });
    it("returns default for Failure", () => {
      const r = fail("1");
      const expected = true;
      const actual = mapNeverOrTrue(r) satisfies boolean;
      assert.equal(actual, expected);
    });
  });

  describe("mapElse", () => {
    const mapElseSucc = mapElse(twiceNum, neverString);
    const mapElseFail = mapElse(neverNum, twiceString);

    it("maps Success value", () => {
      const r = succ(1);
      const expected = 2;
      const actual = mapElseSucc(r) satisfies number;
      assert.equal(actual, expected);
    });
    it("maps Failure value with projFail", () => {
      const r = fail("1");
      const expected = "11";
      const actual = mapElseFail(r) satisfies string;
      assert.equal(actual, expected);
    });
  });
});
