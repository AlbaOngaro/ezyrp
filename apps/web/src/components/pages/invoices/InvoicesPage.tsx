import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { Button } from "../../atoms/button/Button";
import { Heading } from "../../atoms/heading/Heading";

import { CreateInvoiceModal } from "../../organisms/create-invoice-modal/CreateInvoiceModal";
import { InvoicesTable } from "../../organisms/invoices-table/InvoicesTable";
import { Container } from "../../atoms/container/Container";

import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";
import { Card } from "../../atoms/card/Card";

export function InvoicesPage() {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Invoices" description="A list of all the invoices" />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Root open={isCreatingInvoice} onOpenChange={setIsCreatingInvoice}>
            <Trigger asChild>
              <Button size="lg">Add invoice</Button>
            </Trigger>

            <CreateInvoiceModal setIsOpen={setIsCreatingInvoice} />
          </Root>
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
