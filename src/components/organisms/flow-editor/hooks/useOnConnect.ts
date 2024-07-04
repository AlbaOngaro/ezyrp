import { useCallback } from "react";
import { Connection, addEdge } from "reactflow";
import { useEdges } from "./useEdges";

export function useOnConnect() {
  const [, setEdges] = useEdges();

  return useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
}
