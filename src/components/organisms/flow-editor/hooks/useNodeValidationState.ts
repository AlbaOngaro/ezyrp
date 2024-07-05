import { Node } from "reactflow";
import { z } from "zod";
import { isTriggerNode, NodeData, NodeType } from "../types";

import { event } from "./useFlowValidationState";

const actiobNodeSchema = z.discriminatedUnion("action", [
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

const triggerNodeSchema = z
  .object({
    event,
    delay: z.number().optional(),
  })
  .refine(
    (data) =>
      !["event:upcoming", "event:days-passed"].includes(data.event) ||
      typeof data.delay === "number",
    {
      message: "Delay is required for this event",
      path: ["delay"],
    },
  );

export function useNodeValidationState(
  node: Pick<Node<NodeData, NodeType>, "type" | "data">,
) {
  if (isTriggerNode(node)) {
    return triggerNodeSchema.safeParse(node.data);
  }

  return actiobNodeSchema.safeParse(node.data);
}
