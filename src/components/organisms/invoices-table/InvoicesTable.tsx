import { format } from "date-fns";
import Link from "next/link";
import { Link2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

import { useMutation } from "convex/react";
import { useState } from "react";

import { StatusFilter } from "./components/status-filter";
import { CustomerFilter } from "./components/customer-filter";
import { usePaginatedQuery } from "lib/hooks/usePaginatedQuery";
import { Table } from "components/atoms/table";
import {
  Dialog,
  DialogRoot,
  DialogTrigger,
  dialogs,
} from "components/atoms/dialog";
import { Card } from "components/atoms/card";
import { Badge } from "components/atoms/badge";
import { Button } from "components/atoms/button";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

const PAGE_SIZE = 5;

export function InvoicesTable() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<Id<"customers"> | undefined>(
    undefined,
  );

  const [invoiceStatus, setInvoiceStatus] = useState<
    "due" | "paid" | "overdue" | undefined
  >(undefined);

  const {
    results = [],
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.invoices.search,
    {
      customer_id: customerId,
      status: invoiceStatus,
    },
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  const updateInvoice = useMutation(api.invoices.update);
  const deleteInvoice = useMutation(api.invoices.remove);

  return (
    <Card>
      <Table
        loading={isLoading}
        columns={[
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
            filterable: true,
            filterComponent: (
              <CustomerFilter
                customerId={customerId}
                setCustomerId={setCustomerId}
              />
            ),
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
            filterable: true,
            filterComponent: (
              <StatusFilter
                status={invoiceStatus}
                setStatus={setInvoiceStatus}
              />
            ),
            render: (invoice) => <Badge>{invoice.status}</Badge>,
          },
          {
            id: "amount",
            field: "amount",
            headerName: "Amount",
            sortable: true,
            render: (row) => (row.amount / 100).toFixed(2),
          },
        ]}
        rows={results || []}
        withMultiSelect
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
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
                    deleteInvoice({ id: row._id as Id<"invoices"> }),
                  ),
                )
              }
            />
          </DialogRoot>
        )}
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
                  updateInvoice({
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
            onClick: (row) =>
              dialogs.warning({
                title: "Do you really want to delete this invoice?",
                description: "This action cannot be undone",
                onConfirm: () => deleteInvoice({ id: row._id }),
              }),
          },
        ]}
        pagination={{
          status,
          loadMore: () => loadMore(PAGE_SIZE),
          pageSize: PAGE_SIZE,
        }}
      />
    </Card>
  );
}
