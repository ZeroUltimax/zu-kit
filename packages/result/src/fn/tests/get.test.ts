import assert from "node:assert";
import { describe, it } from "node:test";

import { getElse, getOr } from "../get.ts";
import { fail, succ } from "./factory.ts";

describe("Functional Getters", () => {
  const getOrTwo = getOr(2 as const);
  const getElseNever = getElse(
    /* node:coverage ignore next */
    (): 2 => assert.fail("Expected to not call `neverCalled`"),
  );
  const getElseTwice = getElse<"1", 2>((f) => (+f * 2) as 2);

  it(`Or gets the result when success`, () => {
    const expected = 1 as const;
    const r = succ(expected);
    const actual = getOrTwo(r) satisfies 1;

    assert.equal(actual, expected);
  });

  it(`Or gets the default when failure`, () => {
    const expected = 2 as const;
    const r = fail("1");
    const actual = getOrTwo(r) satisfies 2;

    assert.equal(actual, expected);
  });

  it(`Else gets the result when success`, () => {
    const expected = 1 as const;
    const r = succ(expected);
    const actual = getElseNever(r) satisfies 1;

    assert.equal(actual, expected);
  });

  it(`Else gets the default when failure`, () => {
    const expected = 2 as const;
    const r = fail("1");
    const actual = getElseTwice(r) satisfies 2;

    assert.equal(actual, expected);
  });
});
