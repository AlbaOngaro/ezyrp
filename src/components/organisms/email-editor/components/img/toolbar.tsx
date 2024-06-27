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
import { Select } from "components/atoms/select";

const OBJECT_FIT_OPTIONS = [
  { label: "Contain", value: "contain" },
  { label: "Cover", value: "cover" },
  { label: "Fill", value: "fill" },
];

function Toolbar({ element }: { element: ImgElement }) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const toolbar = useRef<HTMLFormElement | null>(null);

  const { style } = element;
  const { justifyContent = "center", objectFit = "contain" } = style || {};

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
      className="grid grid-cols-[repeat(12,2.5rem)] gap-4 items-end w-fit"
      onSubmit={(e) => e.preventDefault()}
    >
      <Select
        className="col-span-3"
        name="objectFit"
        defaultValue={OBJECT_FIT_OPTIONS.find(
          (option) => option.value === objectFit,
        )}
        options={OBJECT_FIT_OPTIONS}
        onChange={(option) => {
          if (option) {
            return onChange("objectFit", option.value);
          }
        }}
      />

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
