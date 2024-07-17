import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import HomePage from "pages";

describe.skip("HomePage", () => {
  test("Renders", () => {
    render(<HomePage />);
    expect(screen.getByTestId("home__header")).toBeDefined();
  });
});
