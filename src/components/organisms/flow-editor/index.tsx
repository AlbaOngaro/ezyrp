import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
} from "reactflow";
import { useCallback, useState, DragEvent } from "react";

import { edgeTypes, initialEdges, initialNodes, nodeTypes } from "./constants";
import { Sidebar } from "./sidebar";
import { NodeData, NodeType } from "./types";
import { getValidUuid } from "lib/utils/getValidUuid";
import { Button } from "components/atoms/button";

function FlowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log("Flow data", flow);
    }
  }, [rfInstance]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<NodeData, NodeType>[],
      ),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const { type, data } = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((curr) => [
        ...curr,
        {
          id: getValidUuid(),
          type,
          position,
          data,
        },
      ]);
    },
    [screenToFlowPosition],
  );

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
        onInit={setRfInstance}
        proOptions={{
          hideAttribution: true,
        }}
        fitView
      >
        <header className="absolute top-0 left-0 right-0 w-full flex justify-end z-30">
          <Button onClick={onSave}>Save</Button>
        </header>
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

const EnhancedFlowEditor = () => (
  <ReactFlowProvider>
    <FlowEditor />
  </ReactFlowProvider>
);

export { EnhancedFlowEditor as FlowEditor };
