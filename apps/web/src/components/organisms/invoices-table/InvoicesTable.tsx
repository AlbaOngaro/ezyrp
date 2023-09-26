import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Link2Icon } from "@radix-ui/react-icons";

import { useRouter } from "next/router";
import { Invoice } from "../../../__generated__/graphql";

import { useInvoices } from "../../../hooks/useInvoices";

import { Table } from "../../atoms/table/Table";
import { Button } from "../../atoms/button/Button";
import { Badge } from "../../atoms/badge/Badge";
import { Dialog } from "../../atoms/dialog/Dialog";

import { getBadgeVariantFromStatus } from "../../../lib/utils/getBadgeVariantFromStatus";

export function InvoicesTable() {
  const router = useRouter();
  const invoices = useInvoices();

  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Table<Invoice>
        loading={invoices.isLoading}
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
            render: ({ emitted }) => format(new Date(emitted), "dd/MM/yyyy"),
          },
          {
            id: "due",
            field: "due",
            headerName: "Due Date",
            sortable: true,
            render: ({ due }) => format(new Date(due), "dd/MM/yyyy"),
          },
          {
            id: "customer",
            field: "customer.name",
            headerName: "Customer",
            render: ({ customer }) => (
              <Link
                href={`/customers/${customer.id}`}
                className="flex items-center gap-2"
              >
                {customer.name} <Link2Icon />
              </Link>
            ),
          },
          {
            id: "status",
            field: "status",
            headerName: "Status",
            sortable: true,
            render: (invoice) => (
              <Badge
                size="sm"
                variant={getBadgeVariantFromStatus(invoice.status)}
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
        rows={invoices?.data?.invoices?.results || []}
        withMultiSelect
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
        withContextMenu
        contextMenuItems={[
          {
            type: "item",
            label: "View",
            onClick: (row) => router.push(`/invoices/${row.id}`),
          },
          {
            type: "item",
            label: "Edit",
            onClick: (row) => router.push(`/invoices/${row.id}/edit`),
          },
          {
            type: "sub",
            label: "Quick actions",
            children: [
              {
                type: "item",
                label: "Mark as paid",
                onClick: (row) =>
                  invoices.update({
                    variables: {
                      updateInvoicesArgs: [
                        {
                          id: row.id,
                          status: "paid",
                        },
                      ],
                    },
                  }),
              },
            ],
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
        withPagination
        pagination={{
          total: invoices?.data?.invoices?.total || 0,
          onPageChange: ({ start, limit }) =>
            invoices.refetch({
              filters: {
                start,
                limit,
              },
            }),
        }}
      />

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
