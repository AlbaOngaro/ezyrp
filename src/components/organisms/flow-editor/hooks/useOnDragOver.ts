import { useCallback, DragEvent } from "react";

export function useOnDragOver() {
  return useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
}
