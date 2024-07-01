import { Transform, usePrevious } from "@dnd-kit/utilities";
import {
  useDraggable,
  DraggableSyntheticListeners,
  DraggableAttributes,
} from "@dnd-kit/core";
import { useRef } from "react";

import { useGetSortableItems } from "../editable/hooks/useGetSortableItems";
import { CustomElement } from "types/slate";

type ChildProps = {
  ref: any;
  transform: string;
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
};

type Props<T extends CustomElement> = {
  id: string;
  data: T;
  disabled?: boolean;
  children: (props: ChildProps) => React.ReactNode;
};

export function DraggableWrapper<T extends CustomElement>({
  id,
  data,
  disabled,
  children,
}: Props<T>) {
  const items = useGetSortableItems();
  const elTransform = useRef<Transform | null>(null);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({
      id,
      data,
      disabled,
    });

  const prevTransform = usePrevious(transform);

  if (items.some((item) => item.id === id)) {
    if (!elTransform.current) {
      elTransform.current = transform;
    }

    return children({
      ref: setActivatorNodeRef,
      listeners,
      transform: (() => {
        if (elTransform.current && transform && prevTransform) {
          const deltaX =
            prevTransform.x === elTransform.current.x
              ? 0
              : transform.x - prevTransform.x;
          const x = elTransform.current.x + deltaX;
          const y = elTransform.current.y + transform.y;

          elTransform.current = {
            ...elTransform.current,
            x,
          };

          return `translate3d(${x}px, ${y}px, 0)`;
        }

        return "unset";
      })(),
    });
  }

  return children({
    ref: setNodeRef,
    listeners,
    attributes,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "unset",
  });
}
