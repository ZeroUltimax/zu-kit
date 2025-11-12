import assert from "node:assert";
import { describe, it } from "node:test";

import { fail, succ } from "./factory.ts";
import { iter } from "./transmute/iter.ts";

describe("Iterator transmutation", () => {
  it("Iterates the success value once", () => {
    const r = succ(0);
    const v = [...iter(r)];
    assert.deepStrictEqual(v, [0]);
  });

  it("Iterates nothing on failure", () => {
    const r = fail("0");
    const v = [...iter(r)];
    assert.deepStrictEqual(v, []);
  });
});
