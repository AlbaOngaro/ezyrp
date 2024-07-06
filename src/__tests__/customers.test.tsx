import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { usePreloadedQuery, useMutation, tAuth } from "./mocks.setup";
import CustomersPage from "pages/customers";
import { api, internal } from "convex/_generated/api";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  usePreloadedQuery,
  useMutation,
}));

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

describe.sequential("Customers page", () => {
  afterEach(async () => {
    console.log("Cleaning up");
    container.remove();
    await tAuth.mutation(internal.tests.clear);
  });

  test("Renders table rows when there are customers", async () => {
    await tAuth.mutation(api.customers.create, {
      name: "Alba",
      email: "alba_ongaro@hotmail.com",
    });

    render(<CustomersPage />, {
      container,
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("table-row")).toHaveLength(1);
      expect(screen.getByTestId("table-cell__name").textContent).toEqual(
        "Alba",
      );
      expect(screen.getByTestId("table-cell__email").textContent).toEqual(
        "alba_ongaro@hotmail.com",
      );
    });
  });

  test("Renders empty table when there are no customers", () => {
    render(<CustomersPage />, {
      container,
    });

    screen.debug();

    // expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });

  test.skip("Renders delete button when checkboxes are checked", async () => {
    render(<CustomersPage />, {
      container,
    });

    expect(screen.getByTestId("table-cell__checkbox")).toBeDefined();
    const checkbox = screen.getByTestId<HTMLInputElement>(
      "table-cell__checkbox-input",
    );
    expect(checkbox).toBeDefined();

    expect(checkbox.checked).toBe(false);
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const deleteButton = screen.getByTestId("customers-table__delete-all-btn");
    expect(deleteButton).toBeDefined();
    await userEvent.click(deleteButton);

    expect(screen.getByTestId("customers__delete-dialog")).toBeDefined();
    const confirmButton = screen.getByTestId(
      "customers__delete-dialog__confirm-btn",
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton);

    // expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });
});
