import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { useMutation, usePaginatedQuery } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import { api, internal } from "convex/_generated/api";
import InventoryPage from "pages/inventory";
import { CHF } from "lib/formatters/chf";

vi.mock("next/router", () => require("next-router-mock"));

vi.mock("convex/react", () => ({
  useMutation,
  usePaginatedQuery,
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

describe("Inventory", () => {
  test("Correctly deletes selected items", async () => {
    await convexMockServer.mutation(api.items.create, {
      name: "Test Item 1",
      description: "Test Description",
      price: 100,
      quantity: 1,
    });

    const page = render(<InventoryPage />, {
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

    const deleteButton = screen.getByTestId("inventory-table__delete-all-btn");
    expect(deleteButton).toBeDefined();
    await userEvent.click(deleteButton);

    expect(screen.getByTestId("inventory__delete-dialog")).toBeDefined();
    const confirmButton = screen.getByTestId(
      "inventory__delete-dialog__confirm-btn",
    );
    expect(confirmButton).toBeDefined();
    await userEvent.click(confirmButton);

    // note: forcing rerender to update the table
    // since mocks queries are not re-fetched automatically
    page.rerender(<InventoryPage />);
    expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });

  test("Correctly displays item prices", async () => {
    await convexMockServer.mutation(api.items.create, {
      name: "Test Item 1",
      description: "Test Description",
      price: 100,
      quantity: 1,
    });

    await convexMockServer.mutation(api.items.create, {
      name: "Test Item 2",
      description: "Test Description",
      price: 1500,
      quantity: 1,
    });

    render(<InventoryPage />, {
      container,
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("inventory-table__price-cell")).toHaveLength(
        2,
      );

      expect(
        screen.getAllByTestId("inventory-table__price-cell")[0].textContent,
      ).toBe(CHF.format(100 / 100));

      expect(
        screen.getAllByTestId("inventory-table__price-cell")[1].textContent,
      ).toBe(CHF.format(1500 / 100));
    });
  });
});
