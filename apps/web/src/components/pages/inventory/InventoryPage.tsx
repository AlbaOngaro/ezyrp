import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { useItems } from "../../../hooks/useItems";

import { CHF } from "../../../lib/formatters/chf";

import { Container } from "../../atoms/container/Container";
import { Heading } from "../../atoms/heading/Heading";
import { Card } from "../../atoms/card/Card";
import { Table } from "../../atoms/table/Table";
import { Button } from "../../atoms/button/Button";

import { CreateItemModal } from "../../organisms/create-item-modal/CreateItemModal";

import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";

export function InventoryPage() {
  const [isCreatingItem, setIsCreatingItem] = useState(false);

  const items = useItems();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Inventory"
          description="A list of all the items in your database."
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Root open={isCreatingItem} onOpenChange={setIsCreatingItem}>
            <Trigger asChild>
              <Button size="lg">Add item</Button>
            </Trigger>

            <CreateItemModal setIsOpen={setIsCreatingItem} />
          </Root>
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
                onClick: console.debug,
              },
              { type: "separator" },
              {
                type: "item",
                label: "Delete",
                onClick: console.debug,
              },
            ]}
          />
        </Card>
      </Container>
    </>
  );
}

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
