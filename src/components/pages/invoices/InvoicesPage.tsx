import { ReactElement } from "react";

import { useRouter } from "next/router";
import { Button } from "../../atoms/button/Button";
import { Heading } from "../../atoms/heading/Heading";

import { InvoicesTable } from "../../organisms/invoices-table/InvoicesTable";
import { Container } from "../../atoms/container/Container";

import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";
import { Card } from "../../atoms/card/Card";

export function InvoicesPage() {
  const router = useRouter();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Invoices" description="A list of all the invoices" />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button size="lg" onClick={() => router.push("/invoices/create")}>
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
