import { Node } from "reactflow";
import { Settings } from "lucide-react";
import { Form } from "@radix-ui/react-form";

import {
  isDelayableTriggerNode,
  isEmailActionNode,
  NodeData,
  NodeType,
} from "../../types";
import { useNodes } from "../../hooks/useNodes";

import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Button } from "components/atoms/button";
import { Select } from "components/atoms/select";
import { Input } from "components/atoms/input";

type Props = Pick<Node<NodeData, NodeType>, "type" | "data" | "id">;

export function NodeSettings(props: Props) {
  const [_, setNodes] = useNodes();
  const { data: emails = [] } = useQuery(api.emails.list);

  if (isEmailActionNode(props)) {
    const options = emails.map((email) => ({
      label: email.title || "[Untitled]",
      value: email._id,
    }));

    const value = options.find(
      (option) => option.value === props.data.template,
    );

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
          <Form>
            <Select
              label="Template"
              name="template"
              value={value}
              options={options}
              onChange={(option) => {
                if (option) {
                  setNodes((prev) =>
                    prev.map((n) => {
                      if (n.id === props.id) {
                        return {
                          ...n,
                          data: {
                            ...n.data,
                            template: option.value,
                          },
                        };
                      }

                      return n;
                    }),
                  );
                }
              }}
            />
          </Form>
        </Modal>
      </ModalRoot>
    );
  }

  if (isDelayableTriggerNode(props)) {
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

  return null;
}
