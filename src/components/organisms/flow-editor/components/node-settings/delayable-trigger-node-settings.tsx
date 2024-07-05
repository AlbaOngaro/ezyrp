import { Node } from "reactflow";
import { Settings } from "lucide-react";
import { Form } from "@radix-ui/react-form";
import { useState, ChangeEvent } from "react";

import { DelayableTriggerNodeData } from "../../types";
import { useNodes } from "../../hooks/useNodes";

import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { Select } from "components/atoms/select";

type Props = Node<DelayableTriggerNodeData, "trigger">;

type Unit = "minutes" | "hours" | "days";

type Option = { label: string; value: Unit };

function getDelayInSelectedUnit(delayInMs: number, unit: Unit): number {
  switch (unit) {
    case "minutes":
      return delayInMs / 1000 / 60;
    case "hours":
      return delayInMs / 1000 / 60 / 60;
    case "days":
      return delayInMs / 1000 / 60 / 60 / 24;
    default:
      return delayInMs as never;
  }
}

function convertDelayToMs(delayInUnit: number, unit: Unit): number {
  switch (unit) {
    case "minutes":
      return delayInUnit * 1000 * 60;
    case "hours":
      return delayInUnit * 1000 * 60 * 60;
    case "days":
      return delayInUnit * 1000 * 60 * 60 * 24;
    default:
      return delayInUnit as never;
  }
}

export function DelayableTriggerNodeSettings(props: Props) {
  const [_, setNodes] = useNodes();
  const [unit, setUnit] = useState<Unit>("minutes");

  const label =
    props.data.event === "event:upcoming"
      ? "How long before the event starts"
      : "How long after the event passed";

  const options: Option[] = [
    { label: "Minutes", value: "minutes" },
    { label: "Hours", value: "hours" },
    { label: "Days", value: "days" },
  ];

  const value = options.find((option) => option.value === unit);

  const onSelectChange = (option: Option | null) => {
    if (option) {
      setUnit(option.value);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const delay = parseInt(e.target.value, 10);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === props.id) {
          return {
            ...n,
            data: {
              ...n.data,
              delay: convertDelayToMs(delay, unit),
            },
          };
        }

        return n;
      }),
    );
  };

  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </ModalTrigger>
      <Modal title={`${props.data.label} Settings`}>
        <Form className="mt-4 grid gap-2 grid-cols-3">
          <label className="col-span-3 text-sm font-semibold">{label}</label>

          <Input
            type="number"
            name="delay"
            className="col-span-2"
            defaultValue={getDelayInSelectedUnit(props.data.delay, unit)}
            min={0}
            max={60}
            onChange={onInputChange}
          />

          <Select
            name="unit"
            options={options}
            value={value}
            onChange={onSelectChange}
          />
        </Form>
      </Modal>
    </ModalRoot>
  );
}
