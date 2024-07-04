import { useCallback, DragEvent } from "react";
import { useReactFlow } from "reactflow";

import { useNodes } from "./useNodes";
import { getValidUuid } from "lib/utils/getValidUuid";

export function useOnDrop() {
  const [_, setNodes] = useNodes();
  const { screenToFlowPosition } = useReactFlow();

  return useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const { type, data } = JSON.parse(
        event.dataTransfer.getData("application/reactflow"),
      );

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((curr) => [
        ...curr,
        {
          id: getValidUuid(),
          type,
          position,
          data,
        },
      ]);
    },
    [screenToFlowPosition, setNodes],
  );
}
