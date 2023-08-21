import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { Button } from "components/atoms/button/Button";
import { CreateInvoiceDialog } from "components/organisms/create-invoice-dialog/CreateInvoiceDialog";
import { InvoicesTable } from "components/organisms/invoices-table/InvoicesTable";

export function InvoicesPage() {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  return (
    <>
      <div className="px-12 py-8 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Invoices
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the invoices
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Root open={isCreatingInvoice} onOpenChange={setIsCreatingInvoice}>
            <Trigger asChild>
              <Button size="md">Add invoice</Button>
            </Trigger>

            <CreateInvoiceDialog setIsOpen={setIsCreatingInvoice} />
          </Root>
        </div>
      </div>

      <InvoicesTable />
    </>
  );
}

InvoicesPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
