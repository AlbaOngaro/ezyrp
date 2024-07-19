import { afterEach, describe, expect, test } from "vitest";

import { getPercentageChange } from "../stats";
import { api, internal } from "../_generated/api";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Stats", () => {
  test("Correcly calculates Percentage Change", () => {
    expect(getPercentageChange(2.625, 3.5)).toBe(-25);
    expect(getPercentageChange(25, -25)).toBe(200);
    expect(getPercentageChange(-50, -25)).toBe(-100);
    expect(getPercentageChange(0, 0)).toBe(0);
  });

  test("Correctly returns requested monthly invoices", async () => {
    const tAuth1 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
    });

    const data1 = await tAuth1.query(api.stats.monthly, {
      year: 2021,
      months: [0, 1],
    });

    expect(data1).toEqual([
      {
        month: "Jan",
        invoices: 0,
      },
      {
        month: "Feb",
        invoices: 0,
      },
    ]);

    const data2 = await tAuth1.query(api.stats.monthly, {
      year: 2021,
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    });

    expect(data2).toEqual([
      {
        month: "Jan",
        invoices: 0,
      },
      {
        month: "Feb",
        invoices: 0,
      },
      {
        month: "Mar",
        invoices: 0,
      },
      {
        month: "Apr",
        invoices: 0,
      },
      {
        month: "May",
        invoices: 0,
      },
      {
        month: "Jun",
        invoices: 0,
      },
      {
        month: "Jul",
        invoices: 0,
      },
      {
        month: "Aug",
        invoices: 0,
      },
      {
        month: "Sep",
        invoices: 0,
      },
      {
        month: "Oct",
        invoices: 0,
      },
      {
        month: "Nov",
        invoices: 0,
      },
      {
        month: "Dec",
        invoices: 0,
      },
    ]);
  });
});
