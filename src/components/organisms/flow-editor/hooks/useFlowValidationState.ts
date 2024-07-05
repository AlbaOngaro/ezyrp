import { z } from "zod";
import { useContext } from "react";
import { WorkflowContext } from "../context";

export const event = z.union([
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
  settings: z
    .discriminatedUnion("action", [
      z.object({
        action: z.literal("email"),
        event,
        template: z.string({
          required_error: "Template is required",
        }),
        delay: z.number().optional(),
      }),
      z.object({
        action: z.literal("sms"),
        event,
        delay: z.number().optional(),
      }),
    ])
    .refine(
      (data) =>
        !["event:upcoming", "event:days-passed"].includes(data.event) ||
        typeof data.delay === "number",
      {
        message: "Delay is required for this event",
        path: ["delay"],
      },
    ),
});

export function useFlowValidationState() {
  const {
    setEdges: _setEdges,
    setNodes: _setNodes,
    ...workflow
  } = useContext(WorkflowContext);

  return flowSchema.safeParse(workflow);
}
