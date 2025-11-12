import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fail, res, succ } from "../factory.ts";
import { isFail, isSucc } from "../guard.ts";
import type { Failure, Success } from "../type.ts";

describe("Result guard", () => {
  describe("Success Guard", () => {
    it("Success is a success", () => {
      const r = succ(1);
      const actual = isSucc(r);
      assert(actual);
    });

    it("Failure is not a success", () => {
      const r = fail("1");
      const actual = isSucc(r);
      assert(!actual);
    });

    it("Successful Result is a success", () => {
      const r = res<number, string>(1, null);
      const actual = isSucc(r);
      assert(actual);
      r satisfies Success<number>;
      // @ts-expect-error We expect success
      r satisfies Failure<string>;
    });

    it("Failure Result is not a success", () => {
      const r = res<number, string>(null, "1");
      const actual = isSucc(r);
      assert(!actual);
      // @ts-expect-error We expect failure
      r satisfies Success<number>;
      r satisfies Failure<string>;
    });
  });

  describe("Failure Guard", () => {
    it("Success is a not a failure", () => {
      const r = succ(1);
      const actual = isFail(r);
      assert(!actual);
    });

    it("Failure is a failure", () => {
      const r = fail("1");
      const actual = isFail(r);
      assert(actual);
    });

    it("Successful Result is not a failure", () => {
      const r = res<number, string>(1, null);
      const actual = isFail(r);
      assert(!actual);
      r satisfies Success<number>;
      // @ts-expect-error We expect success
      r satisfies Failure<string>;
    });

    it("Failure Result is a failrue", () => {
      const r = res<number, string>(null, "1");
      const actual = isFail(r);
      assert(actual);
      // @ts-expect-error We expect failure
      r satisfies Success<number>;
      r satisfies Failure<string>;
    });
  });
});
