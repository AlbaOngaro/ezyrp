import { NodeProps, Position } from "reactflow";

import { useCallback } from "react";
import { Settings, Trash } from "lucide-react";
import { Handle } from "../handle";
import { NodeData, NodeType } from "../../types";

import { useNodes } from "../../hooks/useNodes";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";

export function BaseNode({
  type,
  data,
  id,
  selected,
}: NodeProps<NodeData> & { type: NodeType }) {
  const [_, setNodes] = useNodes();

  const onRemove = useCallback(
    () => setNodes((prev) => prev.filter((node) => node.id !== id)),
    [setNodes, id],
  );

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-white rounded-sm px-6 py-2",
        {
          "border-black": selected,
        },
      )}
    >
      {selected && (
        <div className="flex flex-row bg-gray-200 rounded-sm absolute -top-7 left-0 right-0 w-fit">
          <Button
            size="icon"
            variant="ghost"
            className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
            onClick={onRemove}
          >
            <Trash className="w-3 h-3" />
          </Button>
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
            <Modal title={`${data.label} Settings`}></Modal>
          </ModalRoot>
        </div>
      )}

      {(() => {
        switch (type) {
          case "trigger":
            return <Handle type="source" position={Position.Right} />;
          case "action":
            return <Handle type="target" position={Position.Left} />;
          default:
            return null;
        }
      })()}

      {data.label}
    </div>
  );
}
