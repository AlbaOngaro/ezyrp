import { Root as ModalRoot } from "@radix-ui/react-dialog";
import { Root as DialogRoot } from "@radix-ui/react-alert-dialog";

import { useState } from "react";
import { Table } from "components/atoms/table/Table";
import { Invoice } from "lib/types";
import { useInvoices } from "hooks/useInvoices";

import { Button } from "components/atoms/button/Button";
import { Badge } from "components/atoms/badge/Badge";
import { EditInvoiceModal } from "components/organisms/edit-invoice-modal/EditInvoiceModal";
import { Dialog } from "components/atoms/dialog/Dialog";

export function InvoicesTable() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const invoices = useInvoices();

  return (
    <>
      {/* @ts-ignore */}
      <Table<Invoice>
        withMultiSelect
        withContextMenu
        contextMenuItems={[
          {
            type: "item",
            label: "Edit",
            onClick: (row) => {
              setInvoice(row);
              setIsModalOpen(true);
            },
          },
          {
            type: "separator",
          },
          {
            type: "item",
            label: "Delete",
            onClick: (row) => {
              setInvoice(row);
              setIsDialogOpen(true);
            },
          },
        ]}
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
      <ModalRoot open={isModalOpen} onOpenChange={setIsModalOpen}>
        <EditInvoiceModal
          {...(invoice as Invoice)}
          setIsOpen={setIsModalOpen}
        />
      </ModalRoot>
      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this invoice?"
          description="This action cannot be undone"
          onConfirm={() => {
            if (invoice) {
              return invoices.delete([invoice.id]);
            }
          }}
        />
      </DialogRoot>
    </>
  );
}
