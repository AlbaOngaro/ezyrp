import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";

import { Save } from "lucide-react";
import { edgeTypes, nodeTypes } from "./constants";
import { Sidebar } from "./components/sidebar";
import { useOnNodeDrag } from "./hooks/useOnNodeDrag";
import { useOnNodeDragStop } from "./hooks/useOnNodeDragStop";
import { useNodes } from "./hooks/useNodes";
import { useEdges } from "./hooks/useEdges";
import { WorkflowProvider } from "./context";
import { useOnSave } from "./hooks/useOnSave";
import { useOnDrop } from "./hooks/useOnDrop";
import { useOnDragOver } from "./hooks/useOnDragOver";
import { useOnNodesChange } from "./hooks/useOnNodesChange";
import { useOnEdgesChange } from "./hooks/useOnEdgesChange";
import { useOnConnect } from "./hooks/useOnConnect";

import { useGetInteractionProps } from "./hooks/useGetInteractionProps";
import { Button } from "components/atoms/button";
import { Doc } from "convex/_generated/dataModel";
import { cn } from "lib/utils/cn";

type Props = {
  workflow: Doc<"workflows">;
  mode?: "edit" | "view";
};

function FlowEditor({ mode = "edit" }: Pick<Props, "mode">) {
  const [nodes] = useNodes();
  const [edges] = useEdges();
  const onDrop = useOnDrop();
  const onConnect = useOnConnect();
  const onDragOver = useOnDragOver();
  const onNodeDrag = useOnNodeDrag();
  const onNodesChange = useOnNodesChange();
  const onEdgesChange = useOnEdgesChange();
  const onNodeDragStop = useOnNodeDragStop();
  const interactionProps = useGetInteractionProps(mode);
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();

  return (
    <div
      className={cn("grid gap-4 h-full w-full", {
        "grid-cols-3": mode === "edit",
      })}
    >
      {mode === "edit" && <Sidebar />}
      <ReactFlow
        className="col-span-2"
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        proOptions={{
          hideAttribution: true,
        }}
        fitView
        deleteKeyCode={null}
        {...interactionProps}
      >
        {mode === "edit" && (
          <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end z-30">
            <Button
              className="flex flex-row gap-2"
              loading={isSavingWorkflow}
              onClick={onSave}
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </header>
        )}
        <Controls />
        <Background
          className="bg-gray-50"
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}

const EnhancedFlowEditor = ({ workflow, mode = "edit" }: Props) => (
  <WorkflowProvider workflow={workflow}>
    <ReactFlowProvider>
      <FlowEditor mode={mode} />
    </ReactFlowProvider>
  </WorkflowProvider>
);

export { EnhancedFlowEditor as FlowEditor };
