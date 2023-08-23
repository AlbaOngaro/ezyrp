import { Table } from "components/atoms/table/Table";
import { Invoice } from "lib/types";
import { useInvoices } from "hooks/useInvoices";

import { Button } from "components/atoms/button/Button";
import { Badge } from "components/atoms/badge/Badge";

export function InvoicesTable() {
  const invoices = useInvoices();

  return (
    // @ts-ignore
    <Table<Omit<Invoice, "workspace"> & { actions: string }>
      withMultiSelect
      withContextMenu
      contextMenuItems={[]}
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
