import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAction, useMutation } from "./__mocks__/convex/react";
import { convexMockServer } from "./__mocks__/convex/server";

import { useUser } from "./__mocks__/@clerk/clerk-react";
import { api, internal } from "convex/_generated/api";
import WorkflowsPage from "pages/workflows";
import { EditWorkflowPage } from "components/pages/workflows/EditWorkflowPage";

vi.mock("next/router", () => require("next-router-mock"));
vi.mock("@clerk/clerk-react", () => ({
  useUser,
}));

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

  test("Can run workflow when valid", async () => {
    const tid = await convexMockServer.mutation(api.emails.create, {
      title: "Test template",
    });
    const wid = await convexMockServer.mutation(api.workflows.create, {
      title: "Test workflow",
    });

    await convexMockServer.mutation(api.workflows.update, {
      id: wid,
      edges: [
        {
          id: "reactflow__edge-9695cdac-9430-41b3-b549-cceaab73269a-e98020d7-d399-40e1-9d24-a952fac187b8",
          source: "9695cdac-9430-41b3-b549-cceaab73269a",
          sourceHandle: null,
          target: "e98020d7-d399-40e1-9d24-a952fac187b8",
          targetHandle: null,
        },
      ],
      nodes: [
        {
          data: {
            event: "customer:birthday",
            label: "Customer's Birthday",
          },
          dragging: false,
          height: 52,
          id: "9695cdac-9430-41b3-b549-cceaab73269a",
          position: { x: 141.3359375, y: 190.5 },
          positionAbsolute: { x: 141.3359375, y: 190.5 },
          selected: false,
          type: "trigger",
          width: 224,
        },
        {
          data: {
            action: "email",
            label: "Email",
            template: tid,
          },
          dragging: false,
          height: 52,
          id: "e98020d7-d399-40e1-9d24-a952fac187b8",
          position: {
            x: 483.98966894812804,
            y: 239.3045393235323,
          },
          positionAbsolute: {
            x: 483.98966894812804,
            y: 239.3045393235323,
          },
          selected: true,
          type: "action",
          width: 115,
        },
      ],
      settings: {
        action: "email",
        event: "customer:created",
        template: tid,
      },
    });

    render(<EditWorkflowPage id={wid} />, {
      container,
    });

    await waitFor(() => {
      screen.getByTestId("workflow__container");
    });

    const btn = screen.getByTestId<HTMLButtonElement>(
      "workflows__run-flow-btn",
    );

    expect(btn).toBeDefined();
    await waitFor(() => {
      expect(btn.disabled).toBe(false);
    });
  });
});
