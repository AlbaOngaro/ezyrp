import { useCallback } from "react";
import { EdgeChange, applyEdgeChanges } from "reactflow";
import { useEdges } from "./useEdges";

export function useOnEdgesChange() {
  const [, setEdges] = useEdges();

  return useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
}
