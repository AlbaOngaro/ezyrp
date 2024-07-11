import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Container } from "components/atoms/container";

import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { InventoryTable } from "components/organisms/inventory-table";

export function InventoryPage() {
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
        <InventoryTable />
      </Container>
    </>
  );
}

InventoryPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
