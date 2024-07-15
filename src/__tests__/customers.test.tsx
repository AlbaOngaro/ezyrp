import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useMutation, usePaginatedQuery } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";
import CustomersPage from "pages/customers";
import { api, internal } from "convex/_generated/api";

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

describe("Customers", () => {
  test("Correctly deletes selected customers", async () => {
    await convexMockServer.mutation(api.customers.create, {
      name: "Alba",
      email: "alba_ongaro@hotmail.com",
    });

    const page = render(<CustomersPage key="full" />, {
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

    console.log("Delete customer, rerendering page");

    // note: forcing rerender to update the table
    // since mocks queries are not re-fetched automatically
    page.rerender(<CustomersPage key="empty" />);

    await waitFor(() => {
      expect(screen.getByTestId("table-body--empty")).toBeDefined();
    });
  });

  test("Correclty paginates", async () => {
    await Promise.all(
      Array.from({ length: 7 }).map((_, i) =>
        convexMockServer.mutation(api.customers.create, {
          name: `Test User ${i}`,
          email: `test_user_${1}@example,com`,
        }),
      ),
    );

    render(<CustomersPage />, {
      container,
    });

    await waitFor(async () => {
      expect(screen.getByTestId("table-pagination__prev-button")).toBeDefined();
      expect(
        screen.getByTestId<HTMLButtonElement>("table-pagination__prev-button")
          .disabled,
      ).toBe(true);
      expect(
        screen.getByTestId<HTMLButtonElement>("table-pagination__next-button")
          .disabled,
      ).toBe(false);
      expect(screen.getByTestId("table-pagination__next-button")).toBeDefined();
    });

    await userEvent.click(screen.getByTestId("table-pagination__next-button"));

    await waitFor(() => {
      expect(
        screen.getByTestId<HTMLButtonElement>("table-pagination__next-button")
          .disabled,
      ).toBe(true);
      expect(
        screen.getByTestId<HTMLButtonElement>("table-pagination__prev-button")
          .disabled,
      ).toBe(false);
    });
  });

  test("Can search by email", async () => {
    await convexMockServer.mutation(api.customers.create, {
      name: "Alba",
      email: "jane.doe@example.com",
    });

    await convexMockServer.mutation(api.customers.create, {
      name: "Alba",
      email: "john.doe@example.com",
    });

    render(<CustomersPage />, {
      container,
    });

    expect(screen.getByTestId("customers-table__search-input")).toBeDefined();

    await userEvent.type(
      screen.getByTestId("customers-table__search-input"),
      "jane",
    );

    expect(
      screen.getByTestId<HTMLInputElement>("customers-table__search-input")
        .value,
    ).toBe("jane");

    await waitFor(() => {
      expect(
        screen.getByTestId("customers-table").querySelectorAll("tbody tr"),
      ).toHaveLength(1);
    });

    expect(
      screen.getByTestId("customers-table").querySelector("tbody tr")
        ?.textContent,
    ).toContain("jane.doe@example.com");
  });

  test("Can search by name", async () => {
    await convexMockServer.mutation(api.customers.create, {
      name: "Jane",
      email: "jane.doe@example.com",
    });

    await convexMockServer.mutation(api.customers.create, {
      name: "John",
      email: "completely-different-email@example.com",
    });

    render(<CustomersPage />, {
      container,
    });

    expect(screen.getByTestId("customers-table__search-input")).toBeDefined();

    await userEvent.type(
      screen.getByTestId("customers-table__search-input"),
      "John",
    );

    expect(
      screen.getByTestId<HTMLInputElement>("customers-table__search-input")
        .value,
    ).toBe("John");

    await waitFor(() => {
      expect(
        screen.getByTestId("customers-table").querySelectorAll("tbody tr"),
      ).toHaveLength(1);
    });

    expect(
      screen.getByTestId("customers-table").querySelector("tbody tr")
        ?.textContent,
    ).toContain("John");
  });
});
