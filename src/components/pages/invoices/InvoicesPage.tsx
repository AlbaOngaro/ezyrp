import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { Invoice } from "lib/types";

import { useInvoices } from "hooks/useInvoices";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";
import { CreateInvoiceDialog } from "components/organisms/create-invoice-dialog/CreateInvoiceDialog";

export function InvoicesPage() {
  const invoices = useInvoices();

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

      <Table<Invoice>
        withMultiSelect
        className="px-12"
        columns={[
          {
            id: "id",
            field: "id",
            headerName: "ID",
          },
          {
            id: "customer",
            field: "customer.name",
            headerName: "Customer",
          },
        ]}
        rows={invoices.data}
      />
    </>
  );
}

InvoicesPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
