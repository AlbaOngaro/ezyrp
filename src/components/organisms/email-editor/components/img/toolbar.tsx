import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { Form } from "@radix-ui/react-form";
import { CSSProperties, useRef } from "react";

import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
} from "lucide-react";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { ImgElement } from "types/slate";
import { ToggleGroup, ToggleGroupItem } from "components/atoms/toggle-group";

function Toolbar({ element }: { element: ImgElement }) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const toolbar = useRef<HTMLFormElement | null>(null);

  const { style } = element;
  const { justifyContent = "center" } = style || {};

  const onChange = (
    field: keyof CSSProperties,
    value: CSSProperties[keyof CSSProperties],
  ) => {
    Transforms.setNodes(
      editor,
      {
        style: {
          ...(style || {}),
          [field]: value,
        },
      },
      {
        at,
      },
    );
  };

  return (
    <Form
      ref={toolbar}
      className="grid grid-cols-[repeat(12,2.5rem)] gap-2 items-end w-fit"
      onSubmit={(e) => e.preventDefault()}
    >
      <ToggleGroup
        id="justifyContent"
        type="single"
        value={justifyContent}
        className="col-span-3"
        onValueChange={(value) => onChange("justifyContent", value)}
        variant="outline"
      >
        <ToggleGroupItem value="left">
          <AlignStartVertical className="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <AlignCenterVertical className="w-4 h-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <AlignEndVertical className="w-4 h-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </Form>
  );
}

export function renderToolbar(element: ImgElement) {
  return <Toolbar element={element} />;
}
