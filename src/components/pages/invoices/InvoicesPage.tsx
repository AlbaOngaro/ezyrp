import { ReactElement } from "react";

import { useRouter } from "next/router";

import { Container } from "components/atoms/container";
import { Card } from "components/atoms/card";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { InvoicesTable } from "components/organisms/invoices-table/InvoicesTable";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";

export function InvoicesPage() {
  const router = useRouter();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Invoices" description="A list of all the invoices" />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => router.push("/invoices/create")}>
            Add invoice
          </Button>
        </div>
      </Container>

      <Container as="section">
        <Card>
          <InvoicesTable />
        </Card>
      </Container>
    </>
  );
}

InvoicesPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
