import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";

import { Header } from "./components/header";
import { edgeTypes, nodeTypes } from "./constants";
import { Sidebar } from "./components/sidebar";
import { useOnNodeDrag } from "./hooks/useOnNodeDrag";
import { useOnNodeDragStop } from "./hooks/useOnNodeDragStop";
import { useNodes } from "./hooks/useNodes";
import { useEdges } from "./hooks/useEdges";
import { WorkflowProvider } from "./context";
import { useOnDrop } from "./hooks/useOnDrop";
import { useOnDragOver } from "./hooks/useOnDragOver";
import { useOnNodesChange } from "./hooks/useOnNodesChange";
import { useOnEdgesChange } from "./hooks/useOnEdgesChange";
import { useOnConnect } from "./hooks/useOnConnect";

import { useGetInteractionProps } from "./hooks/useGetInteractionProps";
import { Doc } from "convex/_generated/dataModel";
import { cn } from "lib/utils/cn";

type Props = {
  workflow: Doc<"workflows">;
  mode?: "edit" | "view";
  sidebarClassName?: string;
};

function FlowEditor({
  mode = "edit",
  sidebarClassName,
}: Pick<Props, "mode" | "sidebarClassName">) {
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

  return (
    <div
      className={cn("grid h-full w-full", {
        "grid-cols-3": mode === "edit",
      })}
    >
      {mode === "edit" && <Sidebar className={sidebarClassName} />}
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
        {mode === "edit" && <Header />}
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

const EnhancedFlowEditor = ({
  workflow,
  sidebarClassName,
  mode = "edit",
}: Props) => (
  <WorkflowProvider workflow={workflow}>
    <ReactFlowProvider>
      <FlowEditor mode={mode} sidebarClassName={sidebarClassName} />
    </ReactFlowProvider>
  </WorkflowProvider>
);

export { EnhancedFlowEditor as FlowEditor };
