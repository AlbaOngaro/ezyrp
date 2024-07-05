import { Node } from "reactflow";
import { NodeData, NodeType } from "../../types";

export type Props = Pick<Node<NodeData, NodeType>, "type" | "data" | "id">;
