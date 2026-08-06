import { describe, expect, test } from "bun:test";
import { resolveToken } from "../src/components/theme-logic";

describe("resolveToken", () => {
  test("returns null without a document", () => {
    expect(resolveToken("--s-primary")).toBeNull();
  });
});
