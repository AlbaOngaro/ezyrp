import { Form } from "@radix-ui/react-form";
import { capitalize, get, set } from "lodash";
import { NodeProps } from "reactflow";

import { Select } from "components/atoms/select";
import { NodeData, NodeType } from "components/organisms/flow-editor/types";
import { useNodes } from "components/organisms/flow-editor/hooks/useNodes";

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
        if (setting.type === "select") {
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
        }

        return null;
      })}
    </Form>
  );
}
