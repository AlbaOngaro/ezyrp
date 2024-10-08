import { useRouter } from "next/router";
import { useMutation } from "convex/react";
import { useState } from "react";
import { NameFilter } from "./components/name-filter";

import { usePaginatedQuery } from "lib/hooks/usePaginatedQuery";
import { Button } from "components/atoms/button";
import { Card } from "components/atoms/card";
import {
  Dialog,
  DialogRoot,
  dialogs,
  DialogTrigger,
} from "components/atoms/dialog";
import { Table } from "components/atoms/table";
import { CHF } from "lib/formatters/chf";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const PAGE_SIZE = 5;

export function InventoryTable() {
  const [query, setQuery] = useState("");
  const {
    results = [],
    isLoading,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.items.search,
    {
      query,
    },
    {
      initialNumItems: PAGE_SIZE,
    },
  );
  const router = useRouter();
  const deleteCustomer = useMutation(api.items.remove);

  return (
    <Card>
      <Table
        loading={isLoading}
        rows={results || []}
        columns={[
          {
            id: "name",
            field: "name",
            headerName: "Name",
            filterable: true,
            filterComponent: <NameFilter query={query} setQuery={setQuery} />,
          },
          {
            id: "description",
            field: "description",
            headerName: "Description",
          },
          {
            id: "price",
            field: "price",
            headerName: "Unitary price",
            render: ({ price }) => (
              <span data-testid="inventory-table__price-cell">
                {CHF.format(price / 100)}
              </span>
            ),
            sortable: true,
          },
          {
            id: "quantity",
            field: "quantity",
            headerName: "Qty.",
            sortable: true,
          },
        ]}
        withMultiSelect
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                data-testid="inventory-table__delete-all-btn"
              >
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              data-testid="inventory__delete-dialog"
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected items?"
              description="This action cannot be undone. This will affect the linked invoices."
              onConfirm={() =>
                Promise.all(
                  rows.map((row) =>
                    deleteCustomer({ id: row._id as Id<"items"> }),
                  ),
                )
              }
              cancelButtonProps={{
                // @ts-ignore
                "data-testid": "inventory__delete-dialog__cancel-btn",
              }}
              confirmButtonProps={{
                // @ts-ignore
                "data-testid": "inventory__delete-dialog__confirm-btn",
              }}
            />
          </DialogRoot>
        )}
        contextMenuItems={[
          {
            type: "item",
            label: "View",
            onClick: ({ _id }) => router.push(`/inventory/${_id}`),
          },
          {
            type: "item",
            label: "Edit",
            onClick: ({ _id }) => router.push(`/inventory/${_id}/edit`),
          },
          { type: "separator" },
          {
            type: "item",
            label: "Delete",
            onClick: (row) =>
              dialogs.warning({
                title: "Do you really want to delete this item?",
                description:
                  "This action cannot be undone. This will affect the linked invoices.",
                onConfirm: () => deleteCustomer({ id: row._id }),
              }),
          },
        ]}
        pagination={{
          pageSize: PAGE_SIZE,
          status,
          loadMore: () => loadMore(PAGE_SIZE),
        }}
      />
    </Card>
  );
}
