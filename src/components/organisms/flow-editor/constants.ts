import { Node, Edge, NodeTypes } from "reactflow";

import { DefaultNode } from "./nodes/default";

export const initialNodes: Node[] = [
  { id: "1", type: "default", position: { x: 0, y: 0 }, data: { label: "1" } },
  {
    id: "2",
    type: "default",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
];

export const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

export const nodeTypes: NodeTypes = { default: DefaultNode };
