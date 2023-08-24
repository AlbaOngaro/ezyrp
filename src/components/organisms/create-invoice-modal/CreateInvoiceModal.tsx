import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Root as Form } from "@radix-ui/react-form";
import { format } from "date-fns";

import { Invoice, Customer } from "lib/types";

import { useInvoices } from "hooks/useInvoices";

import { Modal } from "components/atoms/modal/Modal";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";
import { useCustomers } from "hooks/useCustomers";
import { TextArea } from "components/atoms/textarea/TextArea";
import { Input } from "components/atoms/input/Input";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateInvoiceModal({ setIsOpen }: Props) {
  const invoices = useInvoices();
  const customers = useCustomers();

  const [invoice, setInvoice] = useState<Omit<Invoice, "id" | "workspace">>({
    description: "",
    status: "pending",
    customer: customers.data[0],
    amount: 0,
    items: [],
    due: new Date().toISOString(),
    emitted: new Date().toISOString(),
  });

  useEffect(() => {
    setInvoice((curr) => ({
      ...curr,
      customer: customers.data[0],
    }));
  }, [customers.data, customers.isLoading]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await invoices.create([invoice]);
      setInvoice({
        description: "",
        status: "pending",
        customer: customers.data[0],
        amount: 0,
        items: [],
        due: new Date().toISOString(),
        emitted: new Date().toISOString(),
      });
      setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Create new invoice"
      description="Add a new invoice to your database"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <h6 className="uppercase text-indigo-700 font-bold my-2">bill to</h6>
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

        <h6 className="uppercase text-indigo-700 font-bold my-2">details</h6>
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
            onChange={(e) =>
              setInvoice((curr) => ({
                ...curr,
                emitted: new Date(e.target.value).toISOString(),
              }))
            }
          />
          <Input
            className="w-full"
            label="Due Date"
            name="due"
            type="date"
            value={format(new Date(invoice.due), "yyyy-MM-dd")}
            onChange={(e) =>
              setInvoice((curr) => ({
                ...curr,
                due: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </div>

        <h6 className="uppercase text-indigo-700 font-bold my-2">
          invoice items
        </h6>
        <ul className="flex flex-col gap-2">
          <li className="grid grid-cols-12 gap-2">
            <label className="col-span-4 flex flex-col text-sm font-bold text-gray-800">
              Item name
            </label>
            <label className="col-span-2 flex flex-col text-sm font-bold text-gray-800">
              Qty
            </label>
            <label className="col-span-3 flex flex-col text-sm font-bold text-gray-800">
              Price
            </label>
            <label className="flex flex-col text-sm font-bold text-gray-800">
              Total
            </label>
          </li>
          {invoice.items.map((item, i) => (
            <li key={i} className="grid grid-cols-12 gap-2">
              <Input
                className="min-w-0 col-span-4"
                name={`item.${i}.name`}
                value={item.name}
                onChange={(e) =>
                  setInvoice((curr) => ({
                    ...curr,
                    // @ts-ignore
                    items: curr.items.toSpliced(i, 1, {
                      ...curr.items[i],
                      name: e.target.value,
                    }),
                  }))
                }
              />

              <Input
                className="min-w-0 col-span-2"
                name={`item.${i}.quantity`}
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) =>
                  setInvoice((curr) => ({
                    ...curr,
                    // @ts-ignore
                    items: curr.items.toSpliced(i, 1, {
                      ...curr.items[i],
                      quantity: Number(e.target.value),
                    }),
                  }))
                }
              />

              <Input
                className="min-w-0 col-span-3"
                name={`item.${i}.price`}
                type="number"
                value={item.price}
                min={0}
                step={0.01}
                onChange={(e) =>
                  setInvoice((curr) => ({
                    ...curr,
                    // @ts-ignore
                    items: curr.items.toSpliced(i, 1, {
                      ...curr.items[i],
                      price: Number(e.target.value),
                    }),
                  }))
                }
              />

              <strong className="flex items-center col-span-3">
                {(item.quantity * item.price).toFixed(2)}
              </strong>
            </li>
          ))}

          <li>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() =>
                setInvoice((curr) => ({
                  ...curr,
                  items: [
                    ...curr.items,
                    {
                      name: "",
                      quantity: 0,
                      price: 0,
                    },
                  ],
                }))
              }
            >
              Add item
            </Button>
          </li>
        </ul>

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
