import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAction, useMutation } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import { api, internal } from "convex/_generated/api";
import WorkflowsPage from "pages/workflows";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  useMutation,
  useAction,
}));

vi.mock("lib/hooks/useQuery");

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(async () => {
  container.remove();
  await convexMockServer.mutation(internal.tests.cleardb);
});

describe("Workflows", () => {
  test("Correctly deletes selected workflows", async () => {
    await convexMockServer.mutation(api.workflows.create, {
      title: "Test workflow",
    });

    const page = render(<WorkflowsPage />, {
      container,
    });

    await waitFor(() => {
      expect(screen.getByTestId("table-cell__checkbox")).toBeDefined();
    });

    const checkbox = screen.getByTestId<HTMLInputElement>(
      "table-cell__checkbox-input",
    );
    expect(checkbox).toBeDefined();
    expect(checkbox.checked).toBe(false);
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const deleteButton = screen.getByTestId("workflows-table__delete-all-btn");
    expect(deleteButton).toBeDefined();
    await userEvent.click(deleteButton);

    expect(screen.getByTestId("workflows__delete-dialog")).toBeDefined();
    const confirmButton = screen.getByTestId(
      "workflows__delete-dialog__confirm-btn",
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton);

    // note: forcing rerender to update the table
    // since mocks queries are not re-fetched automatically
    page.rerender(<WorkflowsPage />);
    expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });
});
