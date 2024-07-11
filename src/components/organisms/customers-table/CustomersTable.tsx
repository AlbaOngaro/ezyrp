import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { useMutation, usePaginatedQuery } from "convex/react";
import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { Dialog } from "components/atoms/dialog";
import { Table } from "components/atoms/table";
import { Button } from "components/atoms/button";

import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

const PAGE_SIZE = 5;

export function CustomersTable() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.customers.search,
    {},
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  const deleteCustomer = useMutation(api.customers.remove);

  const contextMenuItems = useGetContextMenuItems();

  return (
    <>
      <Table
        loading={isLoading}
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
        rows={results || []}
        withMultiSelect
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                data-testid="customers-table__delete-all-btn"
              >
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              data-testid="customers__delete-dialog"
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected customers?"
              description="This action cannot be undone. All invoices linked to this customer will also be deleted."
              onConfirm={() =>
                Promise.all(
                  rows.map((row) =>
                    deleteCustomer({ id: row._id as Id<"customers"> }),
                  ),
                )
              }
              cancelButtonProps={{
                // @ts-ignore
                "data-testid": "customers__delete-dialog__cancel-btn",
              }}
              confirmButtonProps={{
                // @ts-ignore
                "data-testid": "customers__delete-dialog__confirm-btn",
              }}
            />
          </DialogRoot>
        )}
        contextMenuItems={contextMenuItems}
        pagination={{
          status,
          pageSize: PAGE_SIZE,
          loadMore: () => loadMore(PAGE_SIZE),
        }}
      />
    </>
  );
}
