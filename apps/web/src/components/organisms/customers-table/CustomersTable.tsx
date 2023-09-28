import { useState } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";

import { Customer } from "__generated__/graphql";

import { Dialog } from "components/atoms/dialog/Dialog";
import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";

import { useCustomers } from "hooks/useCustomers";

export function CustomersTable() {
  const router = useRouter();
  const customers = useCustomers();

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Table
        loading={customers.isLoading}
        columns={[
          {
            id: "id",
            field: "id",
            headerName: "ID",
          },
          {
            id: "name",
            field: "name",
            headerName: "Name",
            sortable: true,
          },
          {
            id: "email",
            field: "email",
            headerName: "E-mail",
          },
        ]}
        rows={customers?.data?.customers?.results || []}
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
              title="Do you really want to delete all the selected customers?"
              description="This action cannot be undone"
              onConfirm={() =>
                customers.delete({
                  variables: {
                    deleteCustomerArgs: rows.map((row) => row.id),
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
            label: "Edit",
            onClick: (row) => router.push(`/customers/${row.id}/edit`),
          },
          {
            type: "separator",
          },
          {
            type: "item",
            label: "Delete",
            onClick: (row) => {
              setCustomer(row);
              setIsDialogOpen(true);
            },
          },
        ]}
        withPagination
        pagination={{
          total: customers?.data?.customers?.total || 0,
          onPageChange: ({ start, limit }) =>
            customers.refetch({
              filters: {
                start,
                limit,
              },
            }),
        }}
      />

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this customer?"
          description="All invoices related to this customer will also be deleted. This action cannot be undone."
          onConfirm={() => {
            if (customer) {
              return customers.delete({
                variables: {
                  deleteCustomerArgs: [customer.id],
                },
              });
            }
          }}
        />
      </DialogRoot>
    </>
  );
}
