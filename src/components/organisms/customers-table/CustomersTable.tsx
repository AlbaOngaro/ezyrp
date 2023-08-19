import { ReactElement, useState } from "react";
import { Trigger, Root } from "@radix-ui/react-dialog";

import { EditCustomerDialog } from "../edit-customer-dialog/EditCustomerDialog";

import { Customer } from "lib/types";

import { useCustomers } from "hooks/useCustomers";

import { Table } from "components/atoms/table/Table";
import { Button } from "components/atoms/button/Button";

function Actions({ customer }: { customer: Customer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger asChild>
        <Button size="sm">Edit</Button>
      </Trigger>
      <EditCustomerDialog {...customer} setIsOpen={setIsOpen} />
    </Root>
  );
}

export function CustomersTable() {
  const customers = useCustomers();

  return (
    <Table<Customer & { actions: ReactElement }>
      withMultiSelect
      className="px-12"
      columns={[
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
        },
      ]}
      rows={customers.data.map((customer) => ({
        ...customer,
        actions: <Actions customer={customer} />,
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
