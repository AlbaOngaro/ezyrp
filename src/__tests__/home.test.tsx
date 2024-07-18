import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { addMonths, subMonths } from "date-fns";
import { useMutation, usePaginatedQuery } from "./__mocks__/convex/react";

import HomePage from "pages";
import { getCanGoToNextMonth } from "components/pages/home/HomePage";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  useMutation,
  usePaginatedQuery,
}));

vi.mock("lib/hooks/useQuery");

describe("HomePage", () => {
  test("Renders", () => {
    render(<HomePage />);
    expect(screen.getByTestId("home__heading")).toBeDefined();
  });

  test("Correcly calculates canGoToNextMont", () => {
    const today = new Date();
    expect(getCanGoToNextMonth(subMonths(today, 1))).toBe(true);
    expect(getCanGoToNextMonth(today)).toBe(false);
    expect(getCanGoToNextMonth(addMonths(today, 1))).toBe(false);
  });
});
