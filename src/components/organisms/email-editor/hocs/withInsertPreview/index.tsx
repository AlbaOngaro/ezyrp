import { forwardRef, ForwardRefExoticComponent, RefAttributes } from "react";
import { RenderElementProps } from "slate-react/dist/components/editable";
import { useDndContext, Active, Over, useDndMonitor } from "@dnd-kit/core";
import { Path, Node, Element, Editor, Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import { validate } from "uuid";

function getPreviewPosition(
  active: Active | null,
  over: Over | null,
  element: Element,
): "top" | "bottom" | false {
  if (
    !over ||
    !active ||
    over.id !== element.id ||
    validate(active.id.toString())
  ) {
    return false;
  }

  const overCenter = over?.rect?.top + (over?.rect?.height || 0) / 2;
  const activeCenter =
    (active?.rect?.current?.translated?.top || 0) +
    (active?.rect?.current?.translated?.height || 0) / 2;

  return activeCenter > overCenter ? "bottom" : "top";
}

function Indicator() {
  return (
    <div className="h-1 w-full flex items-center bg-blue-100 before:content-[''] before:block before:w-3 before:h-3 before:border before:border-blue-100 before:rounded-full before:bg-white" />
  );
}

export function withInsertPreview<
  P extends RenderElementProps,
  E extends HTMLElement,
>(Component: ForwardRefExoticComponent<P & RefAttributes<E>>) {
  return forwardRef<E, P>(function WithInsertPreviewWrapper(props, ref) {
    const editor = useSlateStatic();
    const { over, active } = useDndContext();

    const position = getPreviewPosition(active, over, props.element);

    useDndMonitor({
      onDragEnd: ({ over, active }) => {
        if (
          !over ||
          !active ||
          !position ||
          !Node.isNode(active.data.current)
        ) {
          return;
        }

        try {
          const entries = Editor.nodes(editor, {
            at: [],
            match: (node) => Element.isElement(node) && node.id === over.id,
          });

          for (const [, path] of entries) {
            switch (position) {
              case "top":
                Transforms.insertNodes(editor, active.data.current, {
                  at: path,
                });
                break;
              case "bottom":
                Transforms.insertNodes(editor, active.data.current, {
                  at: Path.next(path),
                });
                break;
              default:
                break;
            }
          }
        } catch (error) {
          console.error(error);
        }
      },
    });

    return (
      <div>
        {position === "top" && <Indicator />}
        <Component {...props} ref={ref} />
        {position === "bottom" && <Indicator />}
      </div>
    );
  });
}
