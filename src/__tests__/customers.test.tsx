import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import userEvent from "@testing-library/user-event";
import CustomersPage from "pages/customers";
import { ConvexMocksProvider } from "providers/convex-mocks-provider";

vi.mock("next/router", () => require("next-router-mock"));
const convex = new ConvexReactClient("https://adsf.com", {
  skipConvexDeploymentUrlCheck: true,
});

let container: HTMLElement;

beforeEach(async () => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
});

describe("Customers page", () => {
  test("Renders table rows when there are custoemrs", () => {
    const mocks = new Map();
    mocks.set("customers:list:{}", [
      {
        _creationTime: 1720191604136.1406,
        _id: "j97e80wgrtmh6655sytn96btd56wbz19",
        address: "Via sasso corbaro",
        birthday: "1996-07-05",
        city: "asdf",
        code: "asdf",
        country: "Switzerland",
        email: "alba_ongaro@hotmail.com",
        name: "Alba",
        photoUrl:
          "https://original-ram-409.convex.cloud/api/storage/0df55309-fbbe-476b-af88-1e6eb1066c73",
        workspace: "org_2i5mIFTwLmlRFGpIZMpnYWW2h9q",
      },
    ]);

    render(
      <ConvexProvider client={convex}>
        <ConvexMocksProvider mocks={mocks}>
          <CustomersPage />
        </ConvexMocksProvider>
      </ConvexProvider>,
      {
        container,
      },
    );

    expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    expect(screen.getByTestId("table-cell___id").textContent).toEqual(
      "j97e80wgrtmh6655sytn96btd56wbz19",
    );
    expect(screen.getByTestId("table-cell__name").textContent).toEqual("Alba");
    expect(screen.getByTestId("table-cell__email").textContent).toEqual(
      "alba_ongaro@hotmail.com",
    );
  });

  test("Renders empty table when there are no customers", () => {
    const mocks = new Map();
    mocks.set("customers:list:{}", []);

    render(
      <ConvexProvider client={convex}>
        <ConvexMocksProvider mocks={mocks}>
          <CustomersPage />
        </ConvexMocksProvider>
      </ConvexProvider>,
      {
        container,
      },
    );

    expect(screen.getByTestId("table-body--empty")).toBeDefined();
  });

  test("Renders delete button when checkboxes are checked", async () => {
    const mocks = new Map();
    mocks.set("customers:list:{}", [
      {
        _creationTime: 1720191604136.1406,
        _id: "j97e80wgrtmh6655sytn96btd56wbz19",
        address: "Via sasso corbaro",
        birthday: "1996-07-05",
        city: "asdf",
        code: "asdf",
        country: "Switzerland",
        email: "alba_ongaro@hotmail.com",
        name: "Alba",
        photoUrl:
          "https://original-ram-409.convex.cloud/api/storage/0df55309-fbbe-476b-af88-1e6eb1066c73",
        workspace: "org_2i5mIFTwLmlRFGpIZMpnYWW2h9q",
      },
    ]);

    render(
      <ConvexProvider client={convex}>
        <ConvexMocksProvider mocks={mocks}>
          <CustomersPage />
        </ConvexMocksProvider>
      </ConvexProvider>,
      {
        container,
      },
    );

    expect(screen.getByTestId("table-cell__checkbox")).toBeDefined();
    const checkbox = screen.getByTestId<HTMLInputElement>(
      "table-cell__checkbox-input",
    );
    expect(checkbox).toBeDefined();

    expect(checkbox.checked).toBe(false);
    await userEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    expect(screen.getByTestId("customers-table__delete-all-btn")).toBeDefined();
  });
});
