import { Move, Settings, Trash } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useMemo } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import { validate } from "uuid";
import { Path, Transforms } from "slate";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { Form } from "@radix-ui/react-form";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { PropertiesForm } from "./poperties-form";
import { Options } from "./types";
import { Button } from "components/atoms/button";
import { Dialog } from "components/atoms/dialog";
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "components/atoms/popover";

export function withActionHandlers<
  P extends RenderElementProps,
  E extends HTMLElement,
>(
  Component: ForwardRefExoticComponent<P & RefAttributes<E>>,
  { editableFields }: Options = { editableFields: undefined },
) {
  return function WithDndHandlersWrapper(props: P) {
    const editor = useSlateStatic();

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

    const path = useGetSlatePath(props.element);

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
      <Popover>
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
          <PopoverAnchor asChild>
            <Component {...props} ref={setNodeRef} />
          </PopoverAnchor>

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

              {editableFields && (
                <>
                  <PopoverTrigger asChild>
                    <Button size="icon" variant="outline" className="w-6 h-6">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-96"
                    side="right"
                    align="start"
                    collisionPadding={20}
                  >
                    <Form className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Properties</h4>
                        <p className="text-sm text-muted-foreground">
                          Set the properties for this element
                        </p>
                      </div>

                      <PropertiesForm
                        editableFields={editableFields}
                        element={props.element}
                      />
                    </Form>

                    <PopoverArrow className="fill-gray-200" />
                  </PopoverContent>
                </>
              )}

              <DialogRoot>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="w-6 h-6"
                    disabled={
                      editor.children.length === 1 && Path.equals(path, [0])
                    }
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </DialogTrigger>

                <Dialog
                  overlayClassname="!ml-0"
                  title="Do you really want to remove this item?"
                  onConfirm={() => Transforms.removeNodes(editor, { at: path })}
                />
              </DialogRoot>
            </div>
          )}
        </div>
      </Popover>
    );
  };
}
