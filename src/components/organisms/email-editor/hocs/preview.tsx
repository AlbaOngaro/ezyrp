import { PropsWithChildren, useRef } from "react";
import { Active } from "@dnd-kit/core";

export function Preview({
  children,
  active,
}: PropsWithChildren<{ active: Active | null }>) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const initial = useRef<Pick<DOMRect, "top" | "left"> | null>(null);

  return (
    <div
      style={{
        opacity: "0.5",
        cursor: "default",
        transform: `translate3d(0, 0, 0)`,
      }}
      ref={(el) => {
        wrapper.current = el;
        const r = el?.getBoundingClientRect();
        if (r) {
          initial.current = {
            top: r.top,
            left: r.left,
          };
        }
      }}
    >
      {children}
    </div>
  );
}
