import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useMutation } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";
import CustomersPage from "pages/customers";
import { api, internal } from "convex/_generated/api";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  useMutation,
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

describe.sequential("Customers page", () => {
  test("Renders empty table when there are no customers", () => {
    render(<CustomersPage />, {
      container,
    });

    expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });

  test("Renders table rows when there are customers", async () => {
    await convexMockServer.mutation(api.customers.create, {
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

  test("Correctly deletes selected customers", async () => {
    await convexMockServer.mutation(api.customers.create, {
      name: "Alba",
      email: "alba_ongaro@hotmail.com",
    });

    const page = render(<CustomersPage />, {
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

    const deleteButton = screen.getByTestId("customers-table__delete-all-btn");
    expect(deleteButton).toBeDefined();
    await userEvent.click(deleteButton);

    expect(screen.getByTestId("customers__delete-dialog")).toBeDefined();
    const confirmButton = screen.getByTestId(
      "customers__delete-dialog__confirm-btn",
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton);

    // note: forcing rerender to update the table
    // since mocks queries are not re-fetched automatically
    page.rerender(<CustomersPage />);
    expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });
});
