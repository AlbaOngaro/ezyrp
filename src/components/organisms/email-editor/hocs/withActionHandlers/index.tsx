import { Move, SlidersHorizontal, Trash } from "lucide-react";
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  forwardRef,
  useState,
} from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { useSortable } from "@dnd-kit/sortable";
import { Path, Transforms } from "slate";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { Form } from "@radix-ui/react-form";

import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { EditorConfigProvider, useEditorConfig } from "../../providers/config";
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
import { cn } from "lib/utils/cn";

export function withActionHandlers<
  P extends RenderElementProps,
  E extends HTMLElement,
>(
  Component: ForwardRefExoticComponent<P & RefAttributes<E>>,
  { editableFields, exact = false, actionsClassName }: Options = {},
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<E>> {
  return forwardRef<E, P>(function WithActionHandlersWrapper(props, ref) {
    const editor = useSlateStatic();
    const isReadOnly = ReactEditor.isReadOnly(editor);
    const { dnd, actions } = useEditorConfig();
    const path = useGetSlatePath(props.element);

    const [toolbar, setToolbar] = useState(true);

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      setActivatorNodeRef,
    } = useSortable({
      id: props.element.id,
      disabled: isReadOnly || !dnd,
      data: props.element,
    });

    const isSelected = useGetIsSelected(props.element, {
      exact,
    });

    if (isReadOnly || !actions) {
      return <Component {...props} ref={ref} />;
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
            <EditorConfigProvider toolbar={toolbar}>
              <Component {...props} ref={setNodeRef} />
            </EditorConfigProvider>
          </PopoverAnchor>

          <div
            id="actions"
            className={cn(
              "actions",
              "hidden group-hover:flex hover:flex flex-col gap-2 absolute top-0 -right-8",
              actionsClassName,
              {
                flex: isSelected,
              },
            )}
          >
            {dnd && (
              <Button
                ref={setActivatorNodeRef}
                size="icon"
                variant="outline"
                className="drag-handle w-6 h-6"
                {...listeners}
              >
                <Move className="pointer-events-none w-4 h-4" />
              </Button>
            )}

            {editableFields && (
              <>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline" className="w-6 h-6">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-96"
                  side="right"
                  align="start"
                  collisionPadding={20}
                >
                  <Form
                    className="grid gap-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
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
                  className="w-6 h-6 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToolbar(false);
                  }}
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
                onConfirm={() => {
                  Transforms.removeNodes(editor, { at: path });
                  setToolbar(true);
                }}
                onCancel={() => setToolbar(true)}
              />
            </DialogRoot>
          </div>
        </div>
      </Popover>
    );
  });
}
