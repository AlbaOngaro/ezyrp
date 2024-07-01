import { Node, Edge, NodeTypes, EdgeTypes } from "reactflow";
import { TriggerNode } from "./nodes/trigger";
import { ActionNode } from "./nodes/action";
import { DefaultEdge } from "./edges/default";

export const initialNodes: Node[] = [
  {
    id: "1",
    type: "trigger",
    position: { x: 0, y: 0 },
    data: { label: "Trigger" },
  },
  {
    id: "2",
    type: "action",
    position: { x: 0, y: 100 },
    data: { label: "Action" },
  },
];

export const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
};
