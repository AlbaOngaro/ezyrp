import { ReactElement } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { Container } from "components/atoms/container";
import { useItems } from "hooks/useItems";

import { CHF } from "lib/formatters/chf";

import { Heading } from "components/atoms/heading";
import { Card } from "components/atoms/card";
import { Table } from "components/atoms/table";
import { Button } from "components/atoms/button";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Dialog, dialogs } from "components/atoms/dialog";
import { Id } from "convex/_generated/dataModel";

const PAGE_SIZE = 5;

export function InventoryPage() {
  const items = useItems({
    pageSize: PAGE_SIZE,
  });
  const router = useRouter();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Inventory"
          description="A list of all the items in your database."
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => router.push("/inventory/create")}>
            Add item
          </Button>
        </div>
      </Container>

      <Container as="section">
        <Card>
          <Table
            loading={items.isLoading}
            rows={items.data || []}
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
                        items.delete({ id: row._id as Id<"items"> }),
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
                    onConfirm: () => items.delete({ id: row._id }),
                  }),
              },
            ]}
            pagination={{
              pageSize: PAGE_SIZE,
              status: items.status,
              loadMore: () => items.loadMore(),
            }}
          />
        </Card>
      </Container>
    </>
  );
}

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
