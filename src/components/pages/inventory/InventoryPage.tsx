import { ReactElement, useState } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { Item } from "__generated__/graphql";
import { useItems } from "hooks/useItems";

import { CHF } from "lib/formatters/chf";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Card } from "components/atoms/card/Card";
import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Dialog } from "components/atoms/dialog/Dialog";

export function InventoryPage() {
  const items = useItems();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Inventory"
          description="A list of all the items in your database."
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => router.push("/inventory/create")} size="lg">
            Add item
          </Button>
        </div>
      </Container>

      <Container as="section">
        <Card>
          <Table
            loading={items.loading}
            rows={items.data?.items?.results || []}
            columns={[
              {
                id: "id",
                field: "id",
                headerName: "ID",
              },
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
                render: ({ price }) => CHF.format(price / 100),
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
                  <Button variant="danger" size="sm">
                    Delete all
                  </Button>
                </DialogTrigger>

                <Dialog
                  overlayClassname="!ml-0"
                  title="Do you really want to delete all the selected items?"
                  description="This action cannot be undone"
                  onConfirm={() =>
                    items.delete({
                      variables: {
                        deleteItemsInput: rows.map((row) => row.id),
                      },
                    })
                  }
                />
              </DialogRoot>
            )}
            withPagination
            pagination={{
              total: items.data?.items?.total || 0,
              onPageChange: ({ start, limit }) =>
                items.refetch({
                  filters: {
                    start,
                    limit,
                  },
                }),
            }}
            withContextMenu
            contextMenuItems={[
              {
                type: "item",
                label: "View",
                onClick: console.debug,
              },
              {
                type: "item",
                label: "Edit",
                onClick: ({ id }) => router.push(`/inventory/${id}/edit`),
              },
              { type: "separator" },
              {
                type: "item",
                label: "Delete",
                onClick: (row) => {
                  setItem(row);
                  setIsDialogOpen(true);
                },
              },
            ]}
          />
        </Card>

        <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog
            title="Do you really want to delete this item?"
            description="This action cannot be undone."
            onConfirm={() => {
              if (item) {
                return items.delete({
                  variables: {
                    deleteItemsInput: [item.id],
                  },
                });
              }
            }}
          />
        </DialogRoot>
      </Container>
    </>
  );
}

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
