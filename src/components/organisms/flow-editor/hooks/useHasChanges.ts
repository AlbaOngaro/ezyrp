import { useContext } from "react";
import { WorkflowContext } from "../context";

export function useHasChanges() {
  const { hasChanges } = useContext(WorkflowContext);
  return hasChanges;
}
