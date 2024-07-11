import { useRouter } from "next/router";
import { useMutation } from "convex/react";
import { TableContextMenuItem } from "components/atoms/table/types";
import { Doc } from "convex/_generated/dataModel";
import { dialogs } from "components/atoms/dialog";
import { api } from "convex/_generated/api";

export function useGetContextMenuItems(): TableContextMenuItem<
  Doc<"customers">
>[] {
  const router = useRouter();

  const deleteCustomer = useMutation(api.customers.remove);

  return [
    {
      type: "item",
      label: "View",
      onClick: (row) => router.push(`/customers/${row._id}`),
    },
    {
      type: "item",
      label: "Edit",
      onClick: (row) => router.push(`/customers/${row._id}/edit`),
    },
    {
      type: "separator",
    },
    {
      type: "item",
      label: "Delete",
      onClick: (row) =>
        dialogs.warning({
          title: "Do you really want to delete this customer?",
          description:
            "This action cannot be undone. All invoices linked to this customer will also be deleted.",
          onConfirm: () => deleteCustomer({ id: row._id }),
        }),
    },
  ];
}
