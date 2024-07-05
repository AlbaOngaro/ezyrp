import { Node } from "reactflow";
import { Settings } from "lucide-react";
import { Form } from "@radix-ui/react-form";

import { DelayableTriggerNodeData } from "../../types";
import { useNodes } from "../../hooks/useNodes";

import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";

type Props = Node<DelayableTriggerNodeData, "trigger">;

export function DelayableTriggerNodeSettings(props: Props) {
  const [_, setNodes] = useNodes();

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
        <Form className="mt-4">
          <Input
            type="number"
            label="How long before the event due date should this trigger?"
            name="delay"
            defaultValue={props.data.delay}
            min={0}
            max={60}
            onChange={(e) => {
              const delay = parseInt(e.target.value, 10);

              setNodes((prev) =>
                prev.map((n) => {
                  if (n.id === props.id) {
                    return {
                      ...n,
                      data: {
                        ...n.data,
                        delay,
                      },
                    };
                  }

                  return n;
                }),
              );
            }}
          />
        </Form>
      </Modal>
    </ModalRoot>
  );
}
