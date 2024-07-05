import { useContext } from "react";
import { WorkflowContext } from "../context";

export function useWorkflowId() {
  const { _id } = useContext(WorkflowContext);
  return _id;
}
