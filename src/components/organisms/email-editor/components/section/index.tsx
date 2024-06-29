import { forwardRef, useCallback, useRef, useState, MouseEvent } from "react";
import {
  Editable as SlateEditable,
  ReactEditor,
  RenderElementProps,
  Slate,
  useSlateStatic,
  withReact,
} from "slate-react";
import {
  createEditor,
  Transforms,
  Location,
  Descendant,
  Element,
  Path,
} from "slate";
import { Plus } from "lucide-react";

import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { withIds } from "../../plugins/withIds";
import { withImages } from "../../plugins/withImages";
import { withHr } from "../../plugins/withHr";
import { withColumns } from "../../plugins/wihtColumns";

import { useRenderElement } from "../../hooks/useRenderElement";
import { useRenderLeaf } from "../../hooks/useRenderLeaf";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { EditorConfigProvider } from "../../providers/config";
import { ParentEditorProvider } from "../../providers/parent-editor";
import { Editable } from "./editable";
import { CustomElement, SectionElement } from "types/slate";
import { cn } from "lib/utils/cn";
import { useClickOutsideRect } from "hooks/useClickOutsideRect";
import { Button } from "components/atoms/button";
import { getValidUuid } from "lib/utils/getValidUuid";

interface Props extends RenderElementProps {
  element: SectionElement;
}

function isCustomElementArray(
  descendants: Descendant[],
): descendants is CustomElement[] {
  return descendants.every((descendant) => Element.isElement(descendant));
}

const Section = forwardRef<React.ElementRef<"table">, Readonly<Props>>(
  function Section({ children, attributes, element }, ref) {
    const parent = useSlateStatic();
    const renderLeaf = useRenderLeaf();
    const path = useGetSlatePath(element);
    const renderElement = useRenderElement();
    const tr = useRef<HTMLTableRowElement | null>(null);
    const isSelected = useGetIsSelected(element, {
      exact: true,
    });
    const [editor] = useState(() =>
      withColumns(withHr(withImages(withIds(withReact(createEditor()))))),
    );

    useClickOutsideRect(tr, () => editor.deselect());

    const { style, contents } = element;
    const isReadOnly = ReactEditor.isReadOnly(parent);

    const onValueChange = useCallback(
      (descendants: Descendant[]) => {
        if (isCustomElementArray(descendants)) {
          Transforms.setNodes(
            parent,
            {
              contents: descendants,
            },
            { at: path },
          );
        }
      },
      [parent, path],
    );

    const addNewSection = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        Transforms.insertNodes(
          parent,
          {
            id: getValidUuid(),
            type: "section",
            contents: [
              {
                id: getValidUuid(),
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
            children: [{ text: "" }],
          },
          { at: Path.next(path) },
        );
      },
      [path, parent],
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
      <div
        className={cn(
          "relative w-[calc(100%+8rem)] -ml-16 px-16 py-4",
          "[&:not(:has(.paragraph:hover))]:hover:bg-purple-50 [&:not(:has(.paragraph:hover))]:hover:outline [&:not(:has(.paragraph:hover))]:hover:outline-purple-300",
          "[&:not(:has(.paragraph:hover)):hover>table]:outline [&:not(:has(.paragraph:hover)):hover>table]:outline-purple-200",
          {
            "hover:bg-transparent outline outline-2 outline-purple-300":
              isSelected,
          },
        )}
        {...attributes}
        contentEditable={false}
      >
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
            <tr ref={tr}>
              <EditorConfigProvider dnd={false} actions={false} toolbar={false}>
                <ParentEditorProvider parent={parent}>
                  <Slate
                    editor={editor}
                    initialValue={contents}
                    onValueChange={onValueChange}
                    onSelectionChange={(selection) => {
                      if (Location.isLocation(selection)) {
                        parent.deselect();
                      }
                    }}
                  >
                    <SlateEditable
                      as={Editable}
                      className="focus-within:outline-none"
                      readOnly={isReadOnly}
                      renderLeaf={renderLeaf}
                      renderElement={renderElement}
                      onFocus={() => Transforms.select(parent, [...path, 0])}
                      id={element.id}
                    />
                  </Slate>
                </ParentEditorProvider>
              </EditorConfigProvider>
            </tr>
          </tbody>
        </table>

        {isSelected && (
          <footer className="absolute left-0 right-0 -bottom-3 flex flex-row justify-center">
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

const EnhancedSection = withActionHandlers(Section, {
  exact: true,
  actionsClassName: "top-4",
});

export { EnhancedSection as Section };
