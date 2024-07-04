import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";

import { Dialog, dialogs } from "components/atoms/dialog";
import { Table } from "components/atoms/table";
import { Button } from "components/atoms/button";

import { useCustomers } from "hooks/useCustomers";
import { Id } from "convex/_generated/dataModel";

export function CustomersTable() {
  const router = useRouter();
  const customers = useCustomers();

  return (
    <>
      <Table
        loading={customers.isLoading}
        columns={[
          {
            id: "id",
            field: "_id",
            headerName: "ID",
          },
          {
            id: "name",
            field: "name",
            headerName: "Name",
            sortable: true,
          },
          {
            id: "email",
            field: "email",
            headerName: "E-mail",
          },
        ]}
        rows={customers?.data || []}
        withMultiSelect
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected customers?"
              description="This action cannot be undone. All invoices linked to this customer will also be deleted."
              onConfirm={() =>
                Promise.all(
                  rows.map((row) =>
                    customers.delete({ id: row._id as Id<"customers"> }),
                  ),
                )
              }
            />
          </DialogRoot>
        )}
        withContextMenu
        contextMenuItems={[
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
        ]}
      />
    </>
  );
}
