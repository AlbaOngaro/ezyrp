import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { Button } from "components/atoms/button/Button";
import { Heading } from "components/atoms/heading/Heading";

import { CreateInvoiceModal } from "components/organisms/create-invoice-modal/CreateInvoiceModal";
import { InvoicesTable } from "components/organisms/invoices-table/InvoicesTable";
import { Container } from "components/atoms/container/Container";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

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
        <InvoicesTable />
      </Container>
    </>
  );
}

InvoicesPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
