import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { useCustomers } from "hooks/useCustomers";

import { Modal } from "components/atoms/modal/Modal";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { InputCreateCustomerArgs } from "__generated__/graphql";
import { useFileUpload } from "hooks/useFileUpload";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EMPTY_CUSTOMER: InputCreateCustomerArgs = {
  email: "",
  name: "",
  phone: "",
  photoUrl: "",
};

export function CreateCustomerModal({ setIsOpen }: Props) {
  const { create } = useCustomers();
  const handleFileUpload = useFileUpload();

  const [customer, setCustomer] =
    useState<InputCreateCustomerArgs>(EMPTY_CUSTOMER);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const files = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(
      "input[type=file]",
    )?.files;

    if (files) {
      const photoUrl = await handleFileUpload(files[0]);
      try {
        await create({
          variables: {
            createCustomerArgs: [
              {
                ...customer,
                photoUrl,
              },
            ],
          },
        });
        setCustomer(EMPTY_CUSTOMER);
        setIsOpen(false);
      } catch (error: unknown) {
        console.error(error);
      }

      return;
    }

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
          label="Profile picture"
          className="w-1/3"
          name="photoUrl"
          type="file"
          value={customer.photoUrl || ""}
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];

              const fr = new FileReader();
              const promise = new Promise<string | undefined>(
                (resolve, reject) => {
                  fr.onload = () => {
                    if (fr.result && typeof fr.result === "string") {
                      return resolve(fr.result);
                    }

                    reject();
                  };
                },
              );

              fr.readAsDataURL(file);

              const photoUrl = await promise;

              setCustomer((curr) => ({
                ...curr,
                photoUrl,
              }));
            }
          }}
        />

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
          value={customer.phone || ""}
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
