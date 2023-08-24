import { useState } from "react";
import { Root as ModalRoot } from "@radix-ui/react-dialog";
import { Root as DialogRoot } from "@radix-ui/react-alert-dialog";

import { EditCustomerModal } from "../edit-customer-modal/EditCustomerModal";

import { Customer } from "lib/types";

import { useCustomers } from "hooks/useCustomers";

import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";
import { Dialog } from "components/atoms/dialog/Dialog";

export function CustomersTable() {
  const customers = useCustomers();

  const [customer, setCustomer] = useState<Omit<Customer, "workspace"> | null>(
    null,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Table<Omit<Customer, "workspace">>
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
            id: "email",
            field: "email",
            headerName: "E-mail",
          },
          {
            id: "name",
            field: "name",
            headerName: "Name",
            sortable: true,
          },
          {
            id: "phone",
            field: "phone",
            headerName: "Phone",
          },
        ]}
        rows={customers.data.map((customer) => ({
          ...customer,
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
              onClick={() => customers.delete(rows.map((row) => row.id))}
            >
              Delete all
            </Button>
          </>
        )}
      />

      <ModalRoot open={isModalOpen} onOpenChange={setIsModalOpen}>
        <EditCustomerModal
          {...(customer as Customer)}
          setIsOpen={setIsModalOpen}
        />
      </ModalRoot>

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this customer?"
          description="This action cannot be undone"
          onConfirm={() => {
            if (customer) {
              return customers.delete([customer.id]);
            }
          }}
        />
      </DialogRoot>
    </>
  );
}
