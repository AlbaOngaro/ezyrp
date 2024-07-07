import { Settings } from "lucide-react";
import { Form } from "@radix-ui/react-form";
import { Node } from "reactflow";

import { useEffect } from "react";
import { useNodes } from "../../hooks/useNodes";
import { EmailActionNodeData } from "../../types";

import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Button } from "components/atoms/button";
import { Select } from "components/atoms/select";

type Props = Node<EmailActionNodeData, "action">;

export function EmailActionNodeSettings(props: Props) {
  const [_, setNodes] = useNodes();
  const { data: emails = [] } = useQuery(api.emails.list);

  const options = (emails || []).map((email) => ({
    label: email.title || "[Untitled]",
    value: email._id,
  }));

  const value = options.find((option) => option.value === props.data.template);

  useEffect(() => {
    if (props.data.template && !value) {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === props.id) {
            return {
              ...n,
              data: {
                ...n.data,
                template: undefined,
              },
            };
          }

          return n;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.data.template]);

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
