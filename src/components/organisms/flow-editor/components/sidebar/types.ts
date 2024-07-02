import { ReactElement } from "react";
import { Node as RFNode } from "reactflow";

import { NodeData, NodeType } from "../../types";

export type Node<D extends NodeData, T extends NodeType> = Omit<
  RFNode<D, T>,
  "id" | "position"
> & {
  icon: ReactElement;
};
