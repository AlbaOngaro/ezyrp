import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Customer } from "lib/types";
import { useCustomers } from "hooks/useCustomers";
import { Dialog } from "components/atoms/dialog/Dialog";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";

interface Props extends Customer {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditCustomerDialog({
  id,
  name,
  email,
  phone,
  setIsOpen,
}: Props) {
  const { update } = useCustomers();

  const [customer, setCustomer] = useState<Customer>({
    id,
    name,
    email,
    phone,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await update([customer]);
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Dialog
      title="Edit customer"
      description="Update a new customer in your database"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <Input
          label="Name"
          placeholder="Jane Doe"
          name="name"
          type="text"
          value={customer.name}
          onChange={(e) =>
            setCustomer((curr) => ({
              ...curr,
              name: e.target.value,
            }))
          }
          required
          validations={{
            valueMissing: "This field is required",
          }}
        />
        <Input
          label="Email"
          placeholder="jane.doe@example.com"
          name="email"
          type="email"
          value={customer.email}
          onChange={(e) =>
            setCustomer((curr) => ({
              ...curr,
              email: e.target.value,
            }))
          }
          required
          validations={{
            valueMissing: "This field is required",
          }}
        />
        <Input
          label="Phone"
          placeholder="0012345678"
          name="phone"
          type="tel"
          value={customer.phone}
          onChange={(e) =>
            setCustomer((curr) => ({
              ...curr,
              phone: e.target.value,
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
