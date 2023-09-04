import { Root as ModalRoot } from "@radix-ui/react-dialog";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useState } from "react";

import { format } from "date-fns";
import { Invoice } from "__generated__/graphql";

import { Table } from "components/atoms/table/Table";
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
      <Table<Omit<Invoice, "items">>
        withMultiSelect
        withContextMenu
        contextMenuItems={[
          {
            type: "item",
            label: "Edit",
            onClick: (row) => {
              setInvoice(row as Invoice);
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
              setInvoice(row as Invoice);
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
            id: "emitted",
            field: "emitted",
            headerName: "Emitted",
            sortable: true,
            render: ({ emitted }) => format(new Date(emitted), "dd/mm/yyyy"),
          },
          {
            id: "due",
            field: "due",
            headerName: "Due Date",
            sortable: true,
            render: ({ due }) => format(new Date(due), "dd/mm/yyyy"),
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
                size="md"
                variant={(() => {
                  switch (invoice.status) {
                    case "overdue":
                      return "danger";
                    case "paid":
                      return "success";
                    case "pending":
                    default:
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
        rows={(invoices?.data?.invoices || []) as Invoice[]}
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button variant="danger" size="sm">
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected invoices?"
              description="This action cannot be undone"
              onConfirm={() =>
                invoices.delete({
                  variables: {
                    deleteInvoicesArgs: rows.map((row) => row.id),
                  },
                })
              }
            />
          </DialogRoot>
        )}
      />
      {invoice && (
        <ModalRoot
          open={isModalOpen}
          onOpenChange={(state) => {
            setIsModalOpen(state);
            setInvoice(null);
          }}
        >
          <EditInvoiceModal {...invoice} setIsOpen={setIsModalOpen} />
        </ModalRoot>
      )}
      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this invoice?"
          description="This action cannot be undone"
          onConfirm={() => {
            if (invoice) {
              return invoices.delete({
                variables: {
                  deleteInvoicesArgs: [invoice.id],
                },
              });
            }
          }}
        />
      </DialogRoot>
    </>
  );
}
