import { describe, expect, test } from "bun:test";
import { todayKey } from "../src/lib/date";

describe("todayKey", () => {
  test("matches YYYY-MM-DD format", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
