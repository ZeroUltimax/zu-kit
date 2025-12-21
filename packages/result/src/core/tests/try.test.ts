import assert from "node:assert";
import { describe, it } from "node:test";

import { fail, type Result, resultify, resulting, succ } from "zu-res";

describe("Resulting transmutation", () => {
  function add(a: 1, b: 2): 3 {
    return (a + b) as 3;
  }
  function throwMultiply(a: 4, b: 5): 6 {
    throw (a * b) as 20;
  }
  it("Wraps the return value in success", () => {
    const expected = succ(3);
    const actual = resulting(() => add(1, 2)) satisfies Result<3, unknown>;
    assert.deepStrictEqual(actual, expected);
  });

  it("Wraps the thrown error in failure", () => {
    const expected = fail(20);
    const actual = resulting(() => throwMultiply(4, 5)) satisfies Result<6, unknown>;
    assert.deepStrictEqual(actual, expected);
  });

  it("tryifies a successful function", () => {
    const tryAdd = resultify(add) satisfies (a: 1, b: 2) => Result<3, unknown>;
    const expected = succ(3);
    const actual = tryAdd(1, 2);
    assert.deepStrictEqual(actual, expected);
  });

  it("tryifies a throwing function", () => {
    const tryThrowMultiply = resultify(throwMultiply) satisfies (a: 4, b: 5) => Result<6, unknown>;
    const expected = fail(20);
    const actual = tryThrowMultiply(4, 5);
    assert.deepStrictEqual(actual, expected);
  });

  it("Throws TypeError on nullish error", () => {
    assert.throws(
      resultify(() => {
        throw null;
      }),
      TypeError,
    );
  });
});
