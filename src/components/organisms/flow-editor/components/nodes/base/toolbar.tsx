import { Trash } from "lucide-react";
import { useCallback } from "react";
import { NodeProps } from "reactflow";

import { Button } from "components/atoms/button";

import { useNodes } from "components/organisms/flow-editor/hooks/useNodes";
import { NodeData, NodeType } from "components/organisms/flow-editor/types";
import { useEdges } from "components/organisms/flow-editor/hooks/useEdges";
import { useRenderSettings } from "components/organisms/flow-editor/hooks/useRenderSettings";

export function Toolbar({
  id,
  data,
  type,
}: NodeProps<NodeData> & { type: NodeType }) {
  const [, setNodes] = useNodes();
  const [, setEdges] = useEdges();

  const onRemove = useCallback(() => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== id && edge.target !== id),
    );
  }, [setNodes, setEdges, id]);

  const renderSettings = useRenderSettings();

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
      {renderSettings({ id, type, data })}
    </div>
  );
}
