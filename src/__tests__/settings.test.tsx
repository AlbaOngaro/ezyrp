import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useAuth } from "@clerk/clerk-react";
import {
  useAction,
  useMutation,
  usePaginatedQuery,
} from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import SettingsPage from "pages/settings";
import { internal } from "convex/_generated/api";

vi.mock("next/router", () => require("next-router-mock"));
vi.mock("@clerk/clerk-react");
vi.mock("convex/react", () => ({
  useAction,
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

describe("Settings", () => {
  test("Only shows schedule settings if org:member", () => {
    vi.mocked(useAuth).mockReturnValue({
      // @ts-ignore
      has: ({ role }) => role === "org:member",
    });
    render(<SettingsPage />, {
      container,
    });
    expect(screen.getAllByTestId("settings-page__tab")).toHaveLength(1);
  });

  test("Shows all settings if org:admin", async () => {
    vi.mocked(useAuth).mockReturnValue({
      // @ts-ignore
      has: ({ role }) => role === "org:admin",
    });

    render(<SettingsPage />, {
      container,
    });

    expect(screen.getAllByTestId("settings-page__tab")).toHaveLength(3);
  });
});
