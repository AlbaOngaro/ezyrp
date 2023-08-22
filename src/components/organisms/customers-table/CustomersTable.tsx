import { useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { EditCustomerDialog } from "../edit-customer-dialog/EditCustomerDialog";

import { Customer } from "lib/types";

import { useCustomers } from "hooks/useCustomers";

import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";

function Actions({ customer }: { customer: Omit<Customer, "workspace"> }) {
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
      <EditCustomerDialog {...customer} setIsOpen={setIsOpen} />
    </Root>
  );
}

export function CustomersTable() {
  const customers = useCustomers();

  return (
    <Table<Omit<Customer, "workspace"> & { actions: string }>
      withMultiSelect
      className="px-12"
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
        {
          id: "actions",
          field: "actions",
          headerName: " ",
          render: (customer) => <Actions customer={customer} />,
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
  );
}
