import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Root as Form } from "@radix-ui/react-form";
import { format } from "date-fns";

import { Cross1Icon } from "@radix-ui/react-icons";
import { InputCreateInvoicesArgs } from "../../../__generated__/graphql";

import { useInvoices } from "../../../hooks/useInvoices";

import { Modal } from "../../atoms/modal/Modal";
import { Button } from "../../atoms/button/Button";
import { Select } from "../../atoms/select/Select";
import { useCustomers } from "../../../hooks/useCustomers";
import { TextArea } from "../../atoms/textarea/TextArea";
import { Input } from "../../atoms/input/Input";

import { useItems } from "../../../hooks/useItems";
import { Combobox } from "../../atoms/comobobox/Combobox";
import { CHF } from "../../../lib/formatters/chf";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateInvoiceModal({ setIsOpen }: Props) {
  const items = useItems();
  const invoices = useInvoices();
  const customers = useCustomers();

  const [invoice, setInvoice] = useState<InputCreateInvoicesArgs>({
    description: "",
    status: "pending",
    customer: customers?.data?.customers?.results?.at(0)?.id || "",
    items: [],
    due: new Date().toISOString(),
    emitted: new Date().toISOString(),
  });

  useEffect(() => {
    if (!customers.isLoading && customers.data) {
      setInvoice((curr) => ({
        ...curr,
        customer: customers?.data?.customers?.results?.at(0)?.id || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers.isLoading]);

  const _setIsOpen = useCallback(
    (state: boolean) => {
      setIsOpen(state);
      setInvoice({
        description: "",
        status: "pending",
        customer: customers?.data?.customers?.results?.at(0)?.id || "",
        items: [],
        due: new Date().toISOString(),
        emitted: new Date().toISOString(),
      });
    },
    [customers, setIsOpen],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await invoices.create({
        variables: {
          createInvoicesArgs: [invoice],
        },
      });
      _setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Create new invoice"
      description="Add a new invoice to your database"
      className="overflow-scroll"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <h6 className="uppercase text-orange-600 font-bold my-2">bill to</h6>
        {!customers.isLoading && customers.data && customers.data.customers && (
          <Select
            label="Customer"
            name="customer"
            options={customers.data.customers.results?.map((customer) => ({
              label: customer.name,
              value: customer.id,
            }))}
            onChange={(customer) =>
              setInvoice((curr) => ({
                ...curr,
                customer,
              }))
            }
          />
        )}

        <h6 className="uppercase text-orange-600 font-bold my-2">details</h6>

        <TextArea
          label="Project Description"
          name="description"
          value={invoice.description}
          onChange={(e) =>
            setInvoice((curr) => ({
              ...curr,
              description: e.target.value,
            }))
          }
        />

        <div className="flex flex-row w-full gap-2">
          <Input
            className="w-full"
            label="Invoice Date"
            name="emitted"
            type="date"
            value={format(new Date(invoice.emitted), "yyyy-MM-dd")}
            onChange={(emitted) =>
              setInvoice((curr) => ({
                ...curr,
                emitted: emitted.toISOString(),
              }))
            }
          />
          <Input
            className="w-full"
            label="Due Date"
            name="due"
            type="date"
            value={format(new Date(invoice.due), "yyyy-MM-dd")}
            onChange={(due) =>
              setInvoice((curr) => ({
                ...curr,
                due: due.toISOString(),
              }))
            }
          />
        </div>

        <Combobox
          label="Items"
          className="[&_input]:basis-full"
          onChange={(options) =>
            setInvoice((curr) => ({
              ...curr,
              items: options.map((option) => option.value),
            }))
          }
          options={(items.data?.items?.results || []).map((item) => ({
            label: item.name,
            value: item.id,
            data: item,
            disabled:
              item.quantity ===
              invoice.items.filter((i) => i === item.id).length,
          }))}
          components={{
            Value: ({ option, onRemove }) => (
              <span className="flex flex-row gap-2 items-center bg-gray-100 px-2 py-1 rounded-sm">
                {option.data.name} <small>({option.data.description})</small>{" "}
                {CHF.format(option.data.price / 100)}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                >
                  <Cross1Icon />
                </button>
              </span>
            ),
          }}
        />

        <Button
          type="submit"
          size="lg"
          className="w-fit min-w-[100px] mt-4 ml-auto"
        >
          Save
        </Button>
      </Form>
    </Modal>
  );
}
