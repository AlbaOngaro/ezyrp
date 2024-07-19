import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useAuth, useOrganization } from "@clerk/clerk-react";
import userEvent from "@testing-library/user-event";
import { useAction, useMutation } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import SettingsPage from "pages/settings";
import { internal } from "convex/_generated/api";

vi.mock("next/router", () => require("next-router-mock"));
vi.mock("@clerk/clerk-react");
vi.mock("convex/react", () => ({
  useAction,
  useMutation,
}));

vi.mock("lib/hooks/useQuery");
vi.mock("lib/hooks/usePaginatedQuery");

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

  test("Disables invite button if there are 5 members", async () => {
    vi.mocked(useAuth).mockReturnValue({
      // @ts-ignore
      has: ({ role }) => role === "org:admin",
    });

    vi.mocked(useOrganization).mockReturnValue({
      isLoaded: true,
      // @ts-ignore
      organization: {
        id: "org_test",
      },
      // @ts-ignore
      invitations: {
        data: [],
      },
      memberships: {
        data: [
          {
            id: "1",
            role: "org:member",
            // @ts-ignore
            publicUserData: {
              identifier: "user1@test.com",
            },
          },
          {
            id: "2",
            role: "org:member",
            // @ts-ignore
            publicUserData: {
              identifier: "user2@test.com",
            },
          },
          {
            id: "3",
            role: "org:member",
            // @ts-ignore
            publicUserData: {
              identifier: "user3@test.com",
            },
          },
          {
            id: "4",
            role: "org:member",
            // @ts-ignore
            publicUserData: {
              identifier: "user4@test.com",
            },
          },
          {
            id: "5",
            role: "org:member",
            // @ts-ignore
            publicUserData: {
              identifier: "user5@test.com",
            },
          },
        ],
      },
    });

    render(<SettingsPage />, {
      container,
    });

    expect(screen.getByText("Team")).toBeDefined();
    await userEvent.click(screen.getByText("Team"));

    expect(
      screen.getByTestId<HTMLButtonElement>("settings-team__invite-button")
        .disabled,
    ).toBe(true);
  });
});
