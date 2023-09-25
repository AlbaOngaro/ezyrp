import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { InputCreateInvoicesArgs } from "__generated__/graphql";

import { Button } from "components/atoms/button/Button";

import { useItems } from "hooks/useItems";
import { Select } from "components/atoms/select/Select";
import { CHF } from "lib/formatters/chf";
import { Input } from "components/atoms/input/Input";

interface Props {
  invoice: InputCreateInvoicesArgs;
  setInvoice: Dispatch<SetStateAction<InputCreateInvoicesArgs>>;
}

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

export function InvoiceItemsTable({ invoice, setInvoice }: Props) {
  const { data } = useItems();

  const [items, setItems] = useState(() =>
    invoice.items.reduce<Item[]>((acc, curr) => {
      if (!data || !data.items || !data.items.results) {
        return [];
      }

      const accItem = acc.find((item) => item.id === curr);
      if (accItem) {
        return [
          ...acc.filter((item) => item.id !== curr),
          {
            ...accItem,
            quantity: accItem.quantity + 1,
            total: accItem.price * (accItem.quantity + 1),
          },
        ];
      }

      const item = data.items.results.find((item) => item.id === curr);
      if (item) {
        return [
          ...acc,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            total: item.price,
          },
        ];
      }

      return [
        ...acc,
        {
          id: uuid(),
          name: "",
          price: 0,
          quantity: 1,
          total: 0,
        },
      ];
    }, []),
  );

  useEffect(() => {
    setInvoice((curr) => ({
      ...curr,
      items: Array.from({ length: items.length }, (_, i) => i).flatMap((i) =>
        Array.from({ length: items[i].quantity }, () => items[i].id),
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div>
      <header className="grid grid-cols-[repeat(4,minmax(0,1fr)),4rem] mb-2">
        <h6 className="font-bold">Name</h6>
        <h6 className="font-bold text-center">Price</h6>
        <h6 className="font-bold text-center">Qty</h6>
        <h6 className="font-bold text-right">Total</h6>
      </header>

      {items.map((item, i) => (
        <div
          key={item.id}
          className="grid grid-cols-[repeat(4,minmax(0,1fr)),4rem]"
        >
          <Select
            name="name"
            defaultValue={item.id || " "}
            onChange={(id) =>
              setItems((curr) => {
                const newItem = data?.items?.results?.find(
                  (it) => it.id === id,
                );

                if (newItem) {
                  const quantity = curr.at(i)?.quantity || 1;

                  return curr.toSpliced(i, 1, {
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity,
                    total: newItem.price * quantity,
                  });
                }

                return curr;
              })
            }
            options={
              data?.items?.results?.map((i) => ({
                label: i.name,
                value: i.id,
                disabled: items.some((it) => it.id === i.id),
              })) || []
            }
          />

          <span className="text-center">{CHF.format(item.price / 100)}</span>

          <Input
            name="quantity"
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = Number(e.target.value);

              if (newQuantity > 1) {
                setItems((curr) =>
                  curr.toSpliced(i, 1, {
                    ...item,
                    quantity: newQuantity,
                    total: item.price * newQuantity,
                  }),
                );
              }
            }}
          />

          <span className="text-right">{CHF.format(item.total / 100)}</span>

          <Button
            variant="danger"
            size="sm"
            className="w-6 h-6 rounded-full flex justify-center items-center justify-self-end"
            onClick={() =>
              setItems((curr) => curr.filter((it) => it.id !== item.id))
            }
          >
            <MinusIcon />
          </Button>
        </div>
      ))}

      <Button
        onClick={() =>
          setItems((curr) => [
            ...curr,
            {
              id: uuid(),
              name: "",
              price: 0,
              quantity: 1,
              total: 0,
            },
          ])
        }
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
