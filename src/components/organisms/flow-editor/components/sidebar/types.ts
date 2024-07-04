import { Node as RFNode } from "reactflow";

import { NodeData, NodeType } from "../../types";

export type Node<
  D extends NodeData = NodeData,
  T extends NodeType = NodeType,
> = Omit<RFNode<D, T>, "id" | "position">;
