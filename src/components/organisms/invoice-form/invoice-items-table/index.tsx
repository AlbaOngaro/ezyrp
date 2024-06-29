import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FunctionReturnType } from "convex/server";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { Select } from "components/atoms/select";

import { CHF } from "lib/formatters/chf";

import { useItems } from "hooks/useItems";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { cn } from "lib/utils/cn";
import { getValidUuid } from "lib/utils/getValidUuid";

type Props = {
  disabled?: boolean;
};

export function InvoiceItemsTable({ disabled }: Props) {
  const { data: items, create } = useItems();
  const { control, setValue, watch } =
    useFormContext<FunctionReturnType<typeof api.invoices.get>>();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "key",
  });

  const watchFieldArray = watch("items");
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  return (
    <div>
      <header
        className={cn("grid gap-4 mb-2", {
          "grid-cols-[repeat(4,minmax(0,1fr)),2rem]": !disabled,
          "grid-cols-[repeat(4,minmax(0,1fr))]": disabled,
        })}
      >
        <h6 className="text-sm font-bold text-gray-800">Name</h6>
        <h6 className="text-sm font-bold text-gray-800 text-left">Price</h6>
        <h6 className="text-sm font-bold text-gray-800 text-left">Qty</h6>
        <h6 className="text-sm font-bold text-gray-800 text-right">Total</h6>
      </header>

      <div className="flex flex-col gap-4">
        {controlledFields.map((item, i) => {
          return (
            <div
              key={item.key}
              className={cn("grid gap-4 items-start", {
                "grid-cols-[repeat(4,minmax(0,1fr)),2rem]": !disabled,
                "grid-cols-[repeat(4,minmax(0,1fr))]": disabled,
              })}
            >
              <Select
                isDisabled={disabled}
                isCreatable
                name="name"
                value={item}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                onChange={(option) => {
                  if (option) {
                    const quantity = fields.at(i)?.quantity || 1;
                    update(i, {
                      ...option,
                      quantity,
                    });
                  }
                }}
                onCreateOption={async (name) => {
                  const newItem = await create({
                    name,
                    description: "",
                    quantity: 0,
                    price: 0,
                    onetime: true,
                  });

                  if (newItem) {
                    update(i, newItem);
                  }
                }}
                isOptionDisabled={(option) =>
                  fields.some((it) => it._id === option._id)
                }
                options={items}
              />

              <Input
                className="relative [&>input]:pr-10 after:absolute after:content-['CHF'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
                name="price"
                type="number"
                min={1}
                step={0.05}
                value={item.price / 100}
                disabled={!item.onetime || disabled}
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
                disabled={disabled}
                max={item.onetime ? undefined : item.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  setValue(`items.${i}.quantity` as const, quantity);
                }}
                validations={
                  item.onetime
                    ? undefined
                    : {
                        rangeOverflow: `You don't have enough of this item in stock (${item.quantity} in stock)`,
                      }
                }
              />

              <span className="text-right">
                {CHF.format((item.quantity * item.price) / 100)}
              </span>

              {!disabled && (
                <Button
                  variant="destructive"
                  className="w-6 h-6 p-1.5 rounded-full flex justify-center items-center justify-self-end"
                  onClick={() => {
                    remove(i);
                  }}
                >
                  <MinusIcon />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {!disabled && (
        <Button
          variant="secondary"
          className="w-full mt-4 flex justify-center"
          onClick={(e) => {
            e.preventDefault();

            append({
              workspace: "",
              _id: getValidUuid() as Id<"items">,
              _creationTime: 0,
              name: "",
              price: 0,
              quantity: 1,
              description: "",
              onetime: false,
            });
          }}
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  );
}
