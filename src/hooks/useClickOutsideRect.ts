import { RefObject, useEffect } from "react";

export function useClickOutsideRect(
  element: RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void,
  { tolerance = 0 }: { tolerance?: number } = {},
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const rect = element.current?.getBoundingClientRect();
      if (!rect) return;

      const isOutsideY =
        event.clientY + tolerance < rect.y ||
        event.clientY - tolerance > rect.y + rect.height;

      const isOutsideX =
        event.clientX + tolerance < rect.x ||
        event.clientX - tolerance > rect.x + rect.width;

      if (isOutsideX || isOutsideY) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [element, callback, tolerance]);
}
