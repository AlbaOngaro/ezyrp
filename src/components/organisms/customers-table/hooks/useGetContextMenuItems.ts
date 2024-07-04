import { useRouter } from "next/router";
import { TableContextMenuItem } from "components/atoms/table/types";
import { Doc } from "convex/_generated/dataModel";
import { useCustomers } from "hooks/useCustomers";
import { dialogs } from "components/atoms/dialog";

export function useGetContextMenuItems(): TableContextMenuItem<
  Doc<"customers">
>[] {
  const router = useRouter();
  const customers = useCustomers();

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
          onConfirm: () => customers.delete({ id: row._id }),
        }),
    },
  ];
}
