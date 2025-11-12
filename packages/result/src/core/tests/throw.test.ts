import assert from "node:assert";
import { describe, it } from "node:test";

import { fail, succ } from "./factory.ts";
import { throwing, throwingAsync } from "./transmute/throw.ts";

describe("Throwing transmutation", () => {
  it("Returns the success value", () => {
    const r = succ(2);
    const expected = 2;

    const actual = throwing(r);
    assert.equal(actual, expected);
  });
  it("Throws the failure", () => {
    const r = fail("1");
    const expected = "1";
    assert.throws(
      () => throwing(r),
      (e) => {
        assert.equal(e, expected);
        return true;
      },
    );
  });
  it("Returns the success value async", async () => {
    const r = succ(2);
    const expected = 2;

    const actual = await throwingAsync(r);
    assert.equal(actual, expected);
  });
  it("Throws the failure async", async () => {
    const r = fail("1");
    const expected = "1";
    await assert.rejects(
      () => throwingAsync(r),
      (e) => {
        assert.equal(e, expected);
        return true;
      },
    );
  });
});
