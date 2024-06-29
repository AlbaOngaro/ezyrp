import { forwardRef, MouseEvent, useCallback, useState } from "react";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  useSlateStatic,
  withReact,
} from "slate-react";
import { Plus } from "lucide-react";
import { createEditor, Transforms } from "slate";

import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { withIds } from "../../plugins/withIds";
import { withImages } from "../../plugins/withImages";
import { withHr } from "../../plugins/withHr";
import { withColumns } from "../../plugins/wihtColumns";

import { useRenderElement } from "../../hooks/useRenderElement";
import { useRenderLeaf } from "../../hooks/useRenderLeaf";
import { Button } from "components/atoms/button";
import { SectionElement } from "types/slate";

interface Props extends RenderElementProps {
  element: SectionElement;
}

export const Section = forwardRef<React.ElementRef<"table">, Readonly<Props>>(
  function Section({ children, attributes, element }, ref) {
    const parent = useSlateStatic();
    const renderLeaf = useRenderLeaf();
    const path = useGetSlatePath(element);
    const renderElement = useRenderElement();
    const isSelected = useGetIsSelected(element, {
      exact: true,
    });
    const [editor] = useState(() =>
      withColumns(withHr(withImages(withIds(withReact(createEditor()))))),
    );

    const { style } = element;
    const [_, ...initialValue] = element.children;
    const isReadOnly = ReactEditor.isReadOnly(parent);

    const addNewSection = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        Transforms.select(parent, [...path, 0]);

        console.log(parent.getFragment());

        // Transforms.insertNodes(
        //   editor,
        //   {
        //     id: uuid(),
        //     type: "section",
        //     children: [{ text: "" }],
        //   },
        //   { at: Path.next(path) },
        // );
      },
      [editor, path],
    );

    if (isReadOnly) {
      return (
        <table
          align="center"
          width="100%"
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={style}
          {...attributes}
        >
          <tbody>
            <tr>
              <td>{children}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <div className="relative" {...attributes} contentEditable={false}>
        {children}
        <table
          align="center"
          width="100%"
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={style}
          ref={ref}
        >
          <tbody>
            <tr>
              <Slate
                editor={editor}
                initialValue={initialValue}
                onValueChange={console.debug}
              >
                <Editable
                  as="td"
                  className="focus-within:outline-none"
                  readOnly={isReadOnly}
                  renderLeaf={renderLeaf}
                  renderElement={renderElement}
                  onFocus={() => Transforms.select(parent, [...path, 0])}
                />
              </Slate>
            </tr>
          </tbody>
        </table>

        {isSelected && (
          <footer className="flex flex-row justify-center">
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6"
              onClick={addNewSection}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </footer>
        )}
      </div>
    );
  },
);
