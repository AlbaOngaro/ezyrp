import { useCallback } from "react";
import { NodeDragHandler } from "reactflow";
import { useGetClosestEdge } from "./useGetClosestEdge";
import { useEdges } from "./useEdges";

export function useOnNodeDrag() {
  const [_, setEdges] = useEdges();
  const getClosestEdge = useGetClosestEdge();

  return useCallback<NodeDragHandler>(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target,
          )
        ) {
          return [
            ...nextEdges,
            {
              ...closeEdge,
              className: "temp",
            },
          ];
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges],
  );
}
