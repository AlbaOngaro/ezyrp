import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { addMonths, subDays, subMonths } from "date-fns";
import userEvent from "@testing-library/user-event";

import { useMutation } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import HomePage from "pages";
import { internal } from "convex/_generated/api";
import { getCanGoToNextMonth } from "components/organisms/home-stats-range-picker/helpers";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  useMutation,
}));

vi.mock("lib/hooks/useQuery");
vi.mock("lib/hooks/usePaginatedQuery");

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(async () => {
  container.remove();
  await convexMockServer.mutation(internal.tests.cleardb);
});

describe("HomePage", () => {
  test("Correcly calculates canGoToNextMont", () => {
    const today = new Date();
    expect(getCanGoToNextMonth(subMonths(today, 1))).toBe(true);
    expect(getCanGoToNextMonth(today)).toBe(false);
    expect(getCanGoToNextMonth(addMonths(today, 1))).toBe(false);
  });

  test("Correctly renders date range picker", async () => {
    render(<HomePage />, {
      container,
    });

    expect(screen.getByTestId("home__stats-range-picker")).toBeDefined();
    await userEvent.click(
      screen.getByTestId("home__stats-range-picker__button"),
    );

    const today = new Date();

    expect(screen.getByTestId("home__stats-range-picker--start")).toBeDefined();
    expect(screen.getByTestId("home__stats-range-picker--end")).toBeDefined();

    expect(
      screen.getByTestId("home__stats-range-picker--start").textContent?.trim(),
    ).toBe(subDays(today, 7).getDate().toString());

    expect(
      screen.getByTestId("home__stats-range-picker--end").textContent?.trim(),
    ).toBe(today.getDate().toString());

    expect(
      screen.getByTestId("home__stats-range-picker--next-month"),
    ).toBeDefined();
    expect(
      screen.getByTestId<HTMLButtonElement>(
        "home__stats-range-picker--next-month",
      ).disabled,
    ).toBe(true);

    expect(
      screen.getByTestId("home__stats-range-picker--previous-month"),
    ).toBeDefined();
    expect(
      screen.getByTestId<HTMLButtonElement>(
        "home__stats-range-picker--previous-month",
      ).disabled,
    ).toBe(false);

    await userEvent.click(
      screen.getByTestId("home__stats-range-picker--previous-month"),
    );
    expect(
      screen.getByTestId<HTMLButtonElement>(
        "home__stats-range-picker--next-month",
      ).disabled,
    ).toBe(false);
  });
});
