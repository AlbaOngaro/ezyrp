import { Move, Trash } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useMemo } from "react";
import { ReactEditor, RenderElementProps, useSlateWithV } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import { validate } from "uuid";
import { Path, Transforms } from "slate";

import { Button } from "components/atoms/button";

export function withDndHandlers<
  P extends RenderElementProps,
  E extends HTMLElement,
>(Component: ForwardRefExoticComponent<P & RefAttributes<E>>) {
  return function WithDndHandlersWrapper(props: P) {
    const { editor, v } = useSlateWithV();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      setActivatorNodeRef,
    } = useSortable({
      id: props.element.id,
      disabled: ReactEditor.isReadOnly(editor),
      data: props.element,
    });

    const path = useMemo(() => {
      return ReactEditor.findPath(editor, props.element);
      // passing v to the deps array to force useMemo to recompute the path
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [v, editor, props.element]);

    const isActive = useMemo(() => {
      if (
        editor.selection &&
        Path.isPath(editor.selection.anchor.path) &&
        Path.isDescendant(editor.selection.anchor.path, path)
      ) {
        return true;
      }

      return false;
    }, [editor.selection, path]);

    if (ReactEditor.isReadOnly(editor)) {
      return <Component {...props} />;
    }

    if (!validate(props.element.id)) {
      return (
        <div
          className="relative"
          style={{
            opacity: "0.5",
            cursor: "default",
            transform: transform
              ? `translate3d(0, ${transform.y}px, 0)`
              : "unset",
          }}
          {...attributes}
        >
          <Component {...props} ref={setNodeRef} />
        </div>
      );
    }

    return (
      <div
        className="relative"
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : "unset",
          cursor: "default",
        }}
        {...attributes}
      >
        <Component {...props} ref={setNodeRef} />

        {isActive && (
          <div className="flex flex-col gap-2 absolute top-0 -right-8">
            <Button
              ref={setActivatorNodeRef}
              size="icon"
              variant="outline"
              className="w-6 h-6"
              {...listeners}
            >
              <Move className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => Transforms.removeNodes(editor, { at: path })}
              size="icon"
              variant="destructive"
              className="w-6 h-6"
              disabled={editor.children.length === 1 && Path.equals(path, [0])}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };
}
