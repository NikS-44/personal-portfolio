import { describe, expect, test } from "vitest";
import { parseQuickAdd, stripPriorityToken } from "./quickAdd";

const TODAY = "2026-08-24";

describe("stripPriorityToken", () => {
  test("removes a leading token and its trailing space", () => {
    expect(stripPriorityToken("!p0 Fix the alert")).toBe("Fix the alert");
  });

  test("removes a trailing token", () => {
    expect(stripPriorityToken("Fix the alert !p1")).toBe("Fix the alert");
  });

  test("leaves text without a token untouched", () => {
    expect(stripPriorityToken("Fix the alert")).toBe("Fix the alert");
  });

  test("leaves a bare exclamation alone", () => {
    expect(stripPriorityToken("Fix it! now")).toBe("Fix it! now");
  });

  test("keeps a day token while removing the priority token", () => {
    expect(stripPriorityToken("!p1 Ship @tue")).toBe("Ship @tue");
  });
});

describe("parseQuickAdd priority", () => {
  test("reports no priority when the draft has no token, so the picker can supply one", () => {
    expect(parseQuickAdd("Fix the alert", TODAY).priority).toBeUndefined();
  });

  test("reports the typed token so the chip can mirror it", () => {
    expect(parseQuickAdd("Fix the alert !p0", TODAY).priority).toBe("p0");
  });
});
