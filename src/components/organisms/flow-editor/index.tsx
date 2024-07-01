import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";

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

import { Button } from "components/atoms/button";
import { Doc } from "convex/_generated/dataModel";

type Props = {
  workflow: Doc<"workflows">;
};

function FlowEditor() {
  const [nodes] = useNodes();
  const [edges] = useEdges();
  const onDrop = useOnDrop();
  const onConnect = useOnConnect();
  const onDragOver = useOnDragOver();
  const onNodeDrag = useOnNodeDrag();
  const onNodesChange = useOnNodesChange();
  const onEdgesChange = useOnEdgesChange();
  const onNodeDragStop = useOnNodeDragStop();
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();

  return (
    <div className="grid grid-cols-3 gap-4 h-full w-full">
      <Sidebar />
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
      >
        <header className="absolute top-0 left-0 right-0 w-full flex justify-end z-30">
          <Button loading={isSavingWorkflow} onClick={onSave}>
            Save
          </Button>
        </header>
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

const EnhancedFlowEditor = ({ workflow }: Props) => (
  <WorkflowProvider workflow={workflow}>
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  </WorkflowProvider>
);

export { EnhancedFlowEditor as FlowEditor };
