import { useState } from "react";
import { Root as ModalRoot } from "@radix-ui/react-dialog";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { EditCustomerModal } from "../edit-customer-modal/EditCustomerModal";

import { useCustomers } from "hooks/useCustomers";

import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";
import { Dialog } from "components/atoms/dialog/Dialog";
import { Customer } from "__generated__/graphql";

export function CustomersTable() {
  const customers = useCustomers();

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (customers.isLoading || !customers.data || !customers.data.customers) {
    return null;
  }

  return (
    <>
      <Table<Customer>
        className="px-12"
        withMultiSelect
        withContextMenu
        contextMenuItems={[
          {
            type: "item",
            label: "Edit",
            onClick: (row) => {
              setCustomer(row);
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
              setCustomer(row);
              setIsDialogOpen(true);
            },
          },
        ]}
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
          {
            id: "phone",
            field: "phone",
            headerName: "Phone",
          },
        ]}
        rows={customers.data.customers.results}
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
      />

      <ModalRoot
        open={isModalOpen}
        onOpenChange={(state) => {
          setCustomer(null);
          setIsModalOpen(state);
        }}
      >
        {customer ? (
          <EditCustomerModal {...customer} setIsOpen={setIsModalOpen} />
        ) : null}
      </ModalRoot>

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
