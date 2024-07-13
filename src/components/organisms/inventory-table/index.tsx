import { useRouter } from "next/router";

import { useMutation, usePaginatedQuery } from "convex/react";
import { Form } from "@radix-ui/react-form";
import { debounce } from "lodash";
import { ChangeEvent, useState } from "react";
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
import { Input } from "components/atoms/input";

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
    <>
      <Form className="mb-4 grid grid-cols-4">
        <Input
          label="Search by name"
          name="search"
          type="search"
          onChange={debounce(
            (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
            250,
          )}
        />
      </Form>
      <Card>
        <Table
          loading={isLoading}
          rows={results || []}
          columns={[
            {
              id: "name",
              field: "name",
              headerName: "Name",
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
    </>
  );
}
