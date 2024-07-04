import { Node } from "reactflow";
import { z } from "zod";
import { isTriggerNode, NodeData, NodeType } from "../types";

const nodeSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("email"),
    template: z.string({
      required_error: "Template is required",
    }),
  }),
  z.object({
    action: z.literal("sms"),
  }),
]);

export function useNodeValidationState(
  node: Pick<Node<NodeData, NodeType>, "type" | "data">,
) {
  if (isTriggerNode(node)) {
    return { success: true, error: undefined };
  }

  return nodeSchema.safeParse(node.data);
}
