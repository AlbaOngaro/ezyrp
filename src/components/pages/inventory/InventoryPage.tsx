import { ReactElement } from "react";

import { useItems } from "hooks/useItems";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Card } from "components/atoms/card/Card";
import { Table } from "components/atoms/table/Table";
import { CHF } from "lib/formatters/chf";

export function InventoryPage() {
  const items = useItems();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Inventory"
          description="A list of all the items in your database."
        />
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
                render: ({ price }) => CHF.format(price / 1000),
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
