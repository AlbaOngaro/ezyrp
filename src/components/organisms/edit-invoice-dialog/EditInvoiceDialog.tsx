import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Customer, Invoice } from "lib/types";
import { Dialog } from "components/atoms/dialog/Dialog";
import { Button } from "components/atoms/button/Button";
import { useInvoices } from "hooks/useInvoices";
import { TextArea } from "components/atoms/textarea/TextArea";
import { Select } from "components/atoms/select/Select";
import { useCustomers } from "hooks/useCustomers";

interface Props extends Omit<Invoice, "workspace" | "amount"> {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditInvoiceDialog({
  id,
  customer,
  description,
  status,
  items,
  setIsOpen,
}: Props) {
  const customers = useCustomers();
  const invoices = useInvoices();

  const [invoice, setInvoice] = useState<Omit<Invoice, "workspace" | "amount">>(
    {
      id,
      customer,
      description,
      status,
      items,
    },
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await invoices.update([invoice]);
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Dialog
      title="Edit invoice"
      description="Update an invoice in your database"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <TextArea
          label="Description"
          name="description"
          value={invoice.description}
          onChange={(e) =>
            setInvoice((curr) => ({
              ...curr,
              description: e.target.value,
            }))
          }
          required
          validations={{
            valueMissing: "This field is required",
          }}
        />

        <Select
          label="Status"
          name="status"
          defaultValue={invoice.status}
          onChange={(status) =>
            setInvoice((curr) => ({
              ...curr,
              status: status as Invoice["status"],
            }))
          }
          options={[
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Paid",
              value: "paid",
            },
            {
              label: "Overdue",
              value: "overdue",
            },
          ]}
        />

        <Select
          label="Customer"
          name="customer"
          options={customers.data.map((customer) => ({
            label: customer.name,
            value: customer.id,
          }))}
          onChange={(id) =>
            setInvoice((curr) => ({
              ...curr,
              customer: customers.data.find((c) => c.id === id) as Customer,
            }))
          }
        />

        <Button size="lg" className="w-fit min-w-[100px] mt-4 ml-auto">
          Save
        </Button>
      </Form>
    </Dialog>
  );
}
