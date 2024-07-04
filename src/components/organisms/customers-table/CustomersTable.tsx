import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { Dialog } from "components/atoms/dialog";
import { Table } from "components/atoms/table";
import { Button } from "components/atoms/button";

import { useCustomers } from "hooks/useCustomers";
import { Id } from "convex/_generated/dataModel";

export function CustomersTable() {
  const customers = useCustomers();
  const contextMenuItems = useGetContextMenuItems();

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
        contextMenuItems={contextMenuItems}
      />
    </>
  );
}
