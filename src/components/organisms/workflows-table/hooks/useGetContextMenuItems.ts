import { useMutation } from "convex/react";
import { useRouter } from "next/router";
import { api } from "convex/_generated/api";
import { TableContextMenuItem } from "components/atoms/table/types";
import { Doc } from "convex/_generated/dataModel";
import { dialogs } from "components/atoms/dialog";

export function useGetContextMenuItems(): TableContextMenuItem<
  Doc<"workflows">
>[] {
  const router = useRouter();
  const deleteWorkflow = useMutation(api.workflows.remove);
  const updateWorkflow = useMutation(api.workflows.update);

  return [
    {
      type: "item",
      label: "View",
      onClick: (row) => router.push(`/workflows/${row._id}`),
    },
    {
      type: "item",
      label: "Edit",
      onClick: (row) => router.push(`/workflows/${row._id}/edit`),
    },
    {
      type: "sub",
      label: "Quick actions",
      children: [
        {
          type: "item",
          label: "Toggle status",
          onClick: (row) =>
            updateWorkflow({
              id: row._id,
              status: row.status === "active" ? "inactive" : "active",
            }),
        },
      ],
    },
    {
      type: "separator",
    },
    {
      type: "item",
      label: "Delete",
      onClick: (row) =>
        dialogs.warning({
          title: "Do you really want to delete this workflow?",
          description: "This action cannot be undone",
          onConfirm: () => deleteWorkflow({ id: row._id }),
        }),
    },
  ];
}
