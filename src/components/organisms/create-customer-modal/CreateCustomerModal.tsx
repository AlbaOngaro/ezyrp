import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { useCustomers } from "hooks/useCustomers";

import { Modal } from "components/atoms/modal/Modal";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { InputCreateCustomerArgs } from "__generated__/graphql";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EMPTY_CUSTOMER: InputCreateCustomerArgs = {
  email: "",
  name: "",
  phone: "",
};

export function CreateCustomerModal({ setIsOpen }: Props) {
  const { create } = useCustomers();

  const [customer, setCustomer] =
    useState<InputCreateCustomerArgs>(EMPTY_CUSTOMER);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await create({
        variables: {
          createCustomerArgs: [customer],
        },
      });
      setCustomer(EMPTY_CUSTOMER);
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Create new customer"
      description="Add a new customer to your database"
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
    </Modal>
  );
}
