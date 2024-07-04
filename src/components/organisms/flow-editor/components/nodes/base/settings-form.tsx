import { Form } from "@radix-ui/react-form";
import { capitalize, get, set } from "lodash";
import { NodeProps } from "reactflow";

import { Select } from "components/atoms/select";
import { NodeData, NodeType } from "components/organisms/flow-editor/types";
import { useNodes } from "components/organisms/flow-editor/hooks/useNodes";
import { Input } from "components/atoms/input";

export function SettingsForm({
  data,
  id,
}: NodeProps<NodeData> & { type: NodeType }) {
  const [_, setNodes] = useNodes();

  return (
    <Form
      className="mt-4 flex flex-col gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      {Object.entries(data.settings || {}).map(([key, setting]) => {
        switch (setting.type) {
          case "select":
            return (
              <Select
                label={capitalize(key)}
                key={key}
                name={key}
                options={setting.options}
                defaultValue={setting.value}
                onChange={(option) =>
                  setNodes((prev) =>
                    prev.map((node) => {
                      if (node.id !== id) {
                        return node;
                      }

                      const settings = get(node, "data.settings", {});

                      return set(
                        node,
                        "data.settings",
                        set(settings, `${key}.value`, option),
                      );
                    }),
                  )
                }
              />
            );
          case "input":
            return (
              <Input
                key={key}
                label={capitalize(key)}
                name={key}
                value={setting.value}
                disabled={setting.disabled}
              />
            );
          default:
            return null;
        }
      })}
    </Form>
  );
}
