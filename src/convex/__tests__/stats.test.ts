import { describe, expect, test } from "vitest";

import { getPercentageChange } from "../stats";

describe("Stats", () => {
  test("Correcly calculates Percentage Change", () => {
    expect(getPercentageChange(2.625, 3.5)).toBe(-25);
    expect(getPercentageChange(25, -25)).toBe(200);
    expect(getPercentageChange(-50, -25)).toBe(-100);
    expect(getPercentageChange(0, 0)).toBe(0);
  });
});
