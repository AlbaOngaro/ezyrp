import { Settings, Trash } from "lucide-react";
import { useCallback } from "react";
import { NodeProps } from "reactflow";

import { SettingsForm } from "./settings-form";
import { Button } from "components/atoms/button";

import { useNodes } from "components/organisms/flow-editor/hooks/useNodes";
import { NodeData, NodeType } from "components/organisms/flow-editor/types";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";

export function Toolbar(props: NodeProps<NodeData> & { type: NodeType }) {
  const { id, data } = props;
  const [, setNodes] = useNodes();

  const onRemove = useCallback(
    () => setNodes((prev) => prev.filter((node) => node.id !== id)),
    [setNodes, id],
  );

  return (
    <div className="flex flex-row bg-gray-200 rounded-sm absolute -top-7 left-0 right-0 w-fit">
      <Button
        size="icon"
        variant="ghost"
        className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
        onClick={onRemove}
      >
        <Trash className="w-3 h-3" />
      </Button>
      {data.settings && (
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
          <Modal title={`${data.label} Settings`}>
            <SettingsForm {...props} />
          </Modal>
        </ModalRoot>
      )}
    </div>
  );
}
