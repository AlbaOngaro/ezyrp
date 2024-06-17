import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Modal } from "../../atoms/modal/Modal";
import { Button } from "../../atoms/button/Button";

import { useItems } from "../../../hooks/useItems";
import { Input } from "../../atoms/input/Input";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateItemModal({ setIsOpen }: Props) {
  const items = useItems();

  const [item, setItem] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const _setIsOpen = useCallback(
    (state: boolean) => {
      setIsOpen(state);
      setItem({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
      });
    },
    [setIsOpen],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await items.create({
        ...item,
        price: item.price * 100,
      });
      _setIsOpen(false);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Create new item"
      description="Add a new item to your inventory"
      className="overflow-scroll"
    >
      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={item.name}
          onChange={(e) =>
            setItem((curr) => ({
              ...curr,
              name: e.target.value,
            }))
          }
        />

        <Input
          label="Description"
          name="description"
          value={item.description || ""}
          onChange={(e) =>
            setItem((curr) => ({
              ...curr,
              description: e.target.value,
            }))
          }
        />

        <Input
          label="Price (CHF)"
          name="price"
          type="number"
          step={0.05}
          value={item.price}
          onChange={(e) =>
            setItem((curr) => ({
              ...curr,
              price: Number(e.target.value),
            }))
          }
        />

        <Input
          label="Quantity (Stock)"
          name="quantity"
          type="number"
          value={item.quantity}
          onChange={(e) =>
            setItem((curr) => ({
              ...curr,
              quantity: Number(e.target.value),
            }))
          }
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
