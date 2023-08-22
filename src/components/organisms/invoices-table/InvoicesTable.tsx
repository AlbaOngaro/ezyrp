import { useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { Table } from "components/atoms/table/Table";
import { Invoice } from "lib/types";
import { useInvoices } from "hooks/useInvoices";
import { Button } from "components/atoms/button/Button";
import { EditInvoiceDialog } from "components/organisms/edit-invoice-dialog/EditInvoiceDialog";
import { Badge } from "components/atoms/badge/Badge";

function Actions({ invoice }: { invoice: Omit<Invoice, "workspace"> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger asChild>
        <Button
          className="invisible group-hover:visible transition-colors duration-300"
          size="sm"
        >
          Edit
        </Button>
      </Trigger>
      <EditInvoiceDialog {...invoice} setIsOpen={setIsOpen} />
    </Root>
  );
}

export function InvoicesTable() {
  const invoices = useInvoices();

  return (
    // @ts-ignore
    <Table<Omit<Invoice, "workspace"> & { actions: string }>
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
        {
          id: "status",
          field: "status",
          headerName: "Status",
          sortable: true,
          render: (invoice) => (
            <Badge
              variant={(() => {
                switch (invoice.status) {
                  case "overdue":
                    return "danger";
                  case "paid":
                    return "success";
                  case "pending":
                    return "info";
                }
              })()}
            >
              {invoice.status}
            </Badge>
          ),
        },
        {
          id: "amount",
          field: "amount",
          headerName: "Amount",
          sortable: true,
          render: (row) => (row.amount / 100).toFixed(2),
        },
        {
          id: "actions",
          field: "actions",
          headerName: " ",
          render: (invoice) => <Actions invoice={invoice} />,
        },
      ]}
      rows={invoices.data.map((invoice) => ({
        ...invoice,
        actions: "fake",
      }))}
      renderSelectedActions={(rows) => (
        <>
          <Button variant="secondary" size="sm">
            Bulk edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => invoices.delete(rows.map((row) => row.id))}
          >
            Delete all
          </Button>
        </>
      )}
    />
  );
}
