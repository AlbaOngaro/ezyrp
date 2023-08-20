import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Invoice, Customer } from "lib/types";

import { useInvoices } from "hooks/useInvoices";

import { Dialog } from "components/atoms/dialog/Dialog";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";
import { useCustomers } from "hooks/useCustomers";
import { TextArea } from "components/atoms/textarea/TextArea";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateInvoiceDialog({ setIsOpen }: Props) {
  const invoices = useInvoices();
  const customers = useCustomers();

  const [invoice, setInvoice] = useState<Omit<Invoice, "id">>({
    description: "",
    customer: customers.data[0],
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await invoices.create([invoice]);
      setInvoice({
        description: "",
        customer: customers.data[0],
      });
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Dialog
      title="Create new invoice"
      description="Add a new invoice to your database"
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
