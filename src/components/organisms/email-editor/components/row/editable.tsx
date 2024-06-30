import { debounce } from "lodash";
import { forwardRef } from "react";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import { ResizablePanelGroup } from "components/atoms/resizable";

export const Editable = forwardRef<any, EditableProps>(function Editable(
  { children, ...props },
  ref,
) {
  const editor = useSlateStatic();
  const onLayout = debounce((columns: number[]) => {
    columns.forEach((width, index) => {
      const path = [index];
      Transforms.setNodes(editor, { width }, { at: path });
    });
  }, 250);

  return (
    // @ts-ignore
    <tr {...props} ref={ref}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={onLayout}
        style={{
          overflow: "initial",
        }}
      >
        {children}
      </ResizablePanelGroup>
    </tr>
  );
});
