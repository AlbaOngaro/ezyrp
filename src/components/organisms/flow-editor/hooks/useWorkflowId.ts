import { useContext } from "react";
import { WorkflowContext } from "../context";

export function useWorkflowId() {
  const { id } = useContext(WorkflowContext);
  return id;
}
