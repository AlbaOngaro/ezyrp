import { z } from "zod";
import { useContext } from "react";
import { WorkflowContext } from "../context";

const event = z.union([
  z.literal("customer:created"),
  z.literal("customer:birthday"),
  z.literal("event:upcoming"),
  z.literal("event:days-passed"),
  z.literal("invoice:created"),
  z.literal("invoice:paid"),
  z.literal("invoice:overdue"),
]);

const flowSchema = z.object({
  _id: z.string(),
  title: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  workspace: z.string(),
  nodes: z.array(z.any()).length(2, "There must be exactly 2 nodes"),
  edges: z.array(z.any()).length(1, "There must be exactly 1 edge"),
  settings: z.union([
    z.object({
      action: z.literal("email"),
      event,
      template: z.string(),
    }),
    z.object({
      action: z.literal("sms"),
      event,
    }),
  ]),
});

export function useFlowValidationState() {
  const {
    setEdges: _setEdges,
    setNodes: _setNodes,
    ...workflow
  } = useContext(WorkflowContext);

  return flowSchema.safeParse(workflow);
}
