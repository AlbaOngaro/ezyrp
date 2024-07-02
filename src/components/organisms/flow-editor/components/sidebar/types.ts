import { PropsWithChildren, ReactElement } from "react";

import { NodeData } from "../../types";
import { nodeTypes } from "../../constants";

type NodeTypes = typeof nodeTypes;

export type Node = {
  type?: keyof NodeTypes;
  icon: ReactElement;
  data: NodeData;
};
