import { RefObject, useEffect } from "react";

export function useClickOutsideRect(
  element: RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const rect = element.current?.getBoundingClientRect();
      if (!rect) return;

      const isOutsideY =
        event.clientY < rect.y || event.clientY > rect.y + rect.height;

      const isOutsideX =
        event.clientX < rect.x || event.clientX > rect.x + rect.width;

      if (isOutsideX || isOutsideY) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [element, callback]);
}
