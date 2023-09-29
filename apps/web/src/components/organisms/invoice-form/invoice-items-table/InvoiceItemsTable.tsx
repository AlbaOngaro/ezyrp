import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { v4 as uuid } from "uuid";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { Select } from "components/atoms/select/Select";

import { InvoiceFormValue } from "components/organisms/invoice-form/schema";

import { isSavedItem } from "components/pages/invoices/CreateInvoicePage";

import { CHF } from "lib/formatters/chf";

import { useItems } from "hooks/useItems";

export function InvoiceItemsTable() {
  const items = useItems();
  const { control, setValue, watch } = useFormContext<InvoiceFormValue>();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "key",
  });

  const watchFieldArray = watch("items");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  return (
    <div>
      <header className="grid grid-cols-[repeat(4,minmax(0,1fr)),2rem] gap-4 mb-2">
        <h6 className="text-sm font-bold text-gray-800">Name</h6>
        <h6 className="text-sm font-bold text-gray-800 text-left">Price</h6>
        <h6 className="text-sm font-bold text-gray-800 text-left">Qty</h6>
        <h6 className="text-sm font-bold text-gray-800 text-right">Total</h6>
      </header>

      <div className="flex flex-col gap-4">
        {controlledFields.map((item, i) => (
          <div
            key={item.key}
            className="grid grid-cols-[repeat(4,minmax(0,1fr)),2rem] gap-4 items-start"
          >
            <Select
              isCreatable
              name="name"
              value={{ label: item.name, value: item.id }}
              onChange={(option) => {
                if (option) {
                  const newItem = items?.data?.items?.results?.find(
                    (it) => it.id === option.value,
                  );

                  if (newItem) {
                    const quantity = fields.at(i)?.quantity || 1;
                    update(i, {
                      id: newItem.id,
                      name: newItem.name,
                      price: newItem.price,
                      description: newItem.description || "",
                      onetime: false,
                      quantity,
                    });
                  }
                }
              }}
              onCreateOption={(option) =>
                update(i, {
                  id: item.id,
                  description: "",
                  name: option,
                  price: 0,
                  quantity: 1,
                  onetime: true,
                })
              }
              isOptionDisabled={(option) =>
                fields.some((it) => it.id === option.value)
              }
              options={
                items?.data?.items?.results?.map((i) => ({
                  label: i.name,
                  value: i.id,
                })) || []
              }
            />

            <Input
              className="relative [&>input]:pr-10 after:absolute after:content-['CHF'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
              name="price"
              type="number"
              disabled={isSavedItem(item.id)}
              min={1}
              step={0.05}
              value={item.price / 100}
              onChange={(e) => {
                const price = Number(e.target.value) * 100;
                setValue(`items.${i}.price` as const, price);
              }}
            />

            <Input
              name="quantity"
              type="number"
              value={item.quantity}
              min={1}
              max={
                items?.data?.items?.results.find((it) => it.id === item.id)
                  ?.quantity
              }
              onChange={(e) => {
                const quantity = Number(e.target.value);
                setValue(`items.${i}.quantity` as const, quantity);
              }}
              validations={{
                rangeOverflow: `You don't have enough of this item in stock (${
                  items?.data?.items?.results.find((it) => it.id === item.id)
                    ?.quantity || undefined
                } in stock)`,
              }}
            />

            <span className="text-right">
              {CHF.format((item.quantity * item.price) / 100)}
            </span>

            <Button
              variant="danger"
              className="w-6 h-6 p-1.5 rounded-full flex justify-center items-center justify-self-end"
              onClick={() => remove(i)}
            >
              <MinusIcon />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="tertiary"
        size="xl"
        className="w-full mt-4 flex justify-center"
        onClick={() =>
          append({
            id: uuid(),
            name: "",
            price: 0,
            quantity: 1,
            description: "",
            onetime: false,
          })
        }
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
