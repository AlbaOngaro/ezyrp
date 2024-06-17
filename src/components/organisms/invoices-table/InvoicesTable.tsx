import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Link2Icon } from "@radix-ui/react-icons";

import { useRouter } from "next/router";

import { FunctionReturnType } from "convex/server";
import { useInvoices } from "hooks/useInvoices";

import { Table } from "components/atoms/table";
import { Dialog } from "components/atoms/dialog";

import { getBadgeVariantFromStatus } from "lib/utils/getBadgeVariantFromStatus";
import { Badge } from "components/atoms/badge";
import { Button } from "components/atoms/button";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

type Invoice = FunctionReturnType<typeof api.invoices.get>;

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
            field: "_id",
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
                href={`/customers/${customer._id}`}
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
        rows={invoices?.data || []}
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
                Promise.all(
                  rows.map((row) =>
                    invoices.delete({ id: row._id as Id<"invoices"> }),
                  ),
                )
              }
            />
          </DialogRoot>
        )}
        withContextMenu
        contextMenuItems={[
          {
            type: "item",
            label: "View",
            onClick: (row) => router.push(`/invoices/${row._id}`),
          },
          {
            type: "item",
            label: "Edit",
            onClick: (row) => router.push(`/invoices/${row._id}/edit`),
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
                    id: row._id as Id<"invoices">,
                    status: "paid",
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
      />

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this invoice?"
          description="This action cannot be undone"
          onConfirm={() => {
            if (invoice) {
              return invoices.delete({
                id: invoice._id,
              });
            }
          }}
        />
      </DialogRoot>
    </>
  );
}
