import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import HomePage from "pages";

test("Homepage", () => {
  render(<HomePage />);
  expect(screen.getByTestId("home__header")).toBeDefined();
});
