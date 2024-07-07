import { useRouter } from "next/router";
import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";
import { TableContextMenuItem } from "components/atoms/table/types";
import { Doc } from "convex/_generated/dataModel";
import { dialogs } from "components/atoms/dialog";

export function useGetContextMenuItems(): TableContextMenuItem<
  Doc<"workflows">
>[] {
  const router = useRouter();
  const deleteWorkflow = useMutation(api.workflows.remove);

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
