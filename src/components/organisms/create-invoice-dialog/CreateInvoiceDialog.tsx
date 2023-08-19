import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Invoice } from "lib/types";

import { useInvoices } from "hooks/useInvoices";

import { Dialog } from "components/atoms/dialog/Dialog";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EMPTY_INVOICE: Omit<Invoice, "id"> = {
  description: "",
  customer: {
    id: "",
    email: "",
    name: "",
    phone: "",
  },
};

export function CreateInvoiceDialog({ setIsOpen }: Props) {
  const { create } = useInvoices();

  const [invoice, setInvoice] = useState<Omit<Invoice, "id">>(EMPTY_INVOICE);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await create([invoice]);
      setInvoice(EMPTY_INVOICE);
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
        <Input
          label="Description"
          name="description"
          type="text"
          value={invoice.description}
          onChange={(e) =>
            setInvoice((curr) => ({
              ...curr,
              name: e.target.value,
            }))
          }
          required
          validations={{
            valueMissing: "This field is required",
          }}
        />

        <Button size="lg" className="w-fit min-w-[100px] mt-4 ml-auto">
          Save
        </Button>
      </Form>
    </Dialog>
  );
}
