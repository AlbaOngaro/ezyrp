import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { Form } from "@radix-ui/react-form";
import { useRef } from "react";

import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { ButtonElement, ImgElement } from "types/slate";
import { ToggleGroup, ToggleGroupItem } from "components/atoms/toggle-group";

function Toolbar({ element }: { element: ImgElement }) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const toolbar = useRef<HTMLFormElement | null>(null);

  const _onChange = (
    field: keyof ButtonElement,
    value: ButtonElement[keyof ButtonElement],
  ) => {
    Transforms.setNodes(
      editor,
      {
        [field]: value,
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
      <ToggleGroup type="single" className="col-span-3">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>
    </Form>
  );
}

export function renderToolbar(element: ImgElement) {
  return <Toolbar element={element} />;
}
