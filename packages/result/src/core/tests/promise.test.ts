import assert from "node:assert";
import { describe, it } from "node:test";

import type { Success } from "../type.ts";
import { fail, succ } from "./factory.ts";
import { awaited } from "./transmute/promise.ts";

describe("Promise transmutation", () => {
  it("Awaits the success promise", async () => {
    const r = succ(new Promise<0>((r) => r(0 as const)));
    const expected = succ(0 as const);

    const actual = (await awaited(r)) satisfies Success<0>;

    assert.deepStrictEqual(actual, expected);
  });
  it("Awaits the success promise deeply", async () => {
    const r = succ(new Promise<Promise<0>>((r) => r(new Promise<0>((r) => r(0 as const)))));
    const expected = succ(0 as const);

    const actual = (await awaited(r)) satisfies Success<0>;

    assert.deepStrictEqual(actual, expected);
  });
  it("Passes through failure unchanged", async () => {
    const r = fail<"0">("0");
    const expected = r;

    const actual = await awaited(r);
    assert.equal(actual, expected);
  });
});
