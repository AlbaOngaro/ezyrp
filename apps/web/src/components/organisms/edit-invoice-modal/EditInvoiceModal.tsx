import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Modal } from "../../atoms/modal/Modal";
import { Button } from "../../atoms/button/Button";
import { TextArea } from "../../atoms/textarea/TextArea";
import { Select } from "../../atoms/select/Select";

import { useInvoices } from "../../../hooks/useInvoices";
import { useCustomers } from "../../../hooks/useCustomers";

import { Invoice } from "../../../__generated__/graphql";
import { InputUpdateInvoicesArgs } from "../../../__generated__/server";

interface Props extends Omit<Invoice, "workspace" | "amount"> {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditInvoiceModal({
  id,
  customer,
  description,
  status,
  items,
  emitted,
  due,
  setIsOpen,
}: Props) {
  const customers = useCustomers();
  const invoices = useInvoices();

  const [invoice, setInvoice] = useState<InputUpdateInvoicesArgs>({
    id,
    customer: customer.id,
    description,
    status,
    items: items?.map(({ __typename, ...item }) => item),
    emitted,
    due,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await invoices.update({
        variables: {
          updateInvoicesArgs: [invoice],
        },
      });
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  if (customers.isLoading || !customers.data) {
    return null;
  }

  return (
    <Modal
      title="Edit invoice"
      description="Update an invoice in your database"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <TextArea
          label="Description"
          name="description"
          value={invoice?.description || ""}
          onChange={(e) =>
            setInvoice((curr) => ({
              ...curr,
              description: e.target.value,
            }))
          }
        />

        <Select
          label="Status"
          name="status"
          defaultValue={{
            value: invoice.status || "pending",
            label: invoice.status || "Pending",
          }}
          onChange={(option) =>
            setInvoice((curr) => ({
              ...curr,
              status: option?.value as Invoice["status"],
            }))
          }
          options={[
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Overdue",
              value: "overdue",
            },
            {
              label: "Paid",
              value: "paid",
            },
          ]}
        />

        {!customers.isLoading && customers.data && customers.data.customers && (
          <Select
            label="Customer"
            name="customer"
            options={customers.data.customers.results.map((customer) => ({
              label: customer.name,
              value: customer.id,
            }))}
            onChange={(option) =>
              setInvoice((curr) => ({
                ...curr,
                customer: option?.value,
              }))
            }
          />
        )}

        <Button size="lg" className="w-fit min-w-[100px] mt-4 ml-auto">
          Save
        </Button>
      </Form>
    </Modal>
  );
}
