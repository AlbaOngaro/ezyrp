import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { Form } from "@radix-ui/react-form";
import { get } from "lodash";
import {
  ALargeSmall,
  Baseline,
  Bold,
  Italic,
  RemoveFormatting,
  Space,
  Strikethrough,
  Underline,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useRef } from "react";

import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { ParagraphElement } from "types/slate";
import { getCSSValueWithoutUnit } from "lib/utils/getCSSValueWithoutUnit";
import { Input } from "components/atoms/input";
import { Button } from "components/atoms/button";
import { Toggle } from "components/atoms/toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/atoms/hover-card";
import { Select } from "components/atoms/select";
import { convertRemToPx } from "lib/utils/convertRemToPx";

const OPTIONS = [
  {
    value: "paragraph",
    type: "paragraph" as const,
    label: "Paragraph",
    style: {
      fontSize: convertRemToPx(1),
      fontWeight: "normal",
    },
  },
  {
    value: "heading-1",
    label: "Heading 1",
    type: "heading" as const,
    as: "h1" as const,
    style: {
      fontSize: convertRemToPx(2),
      fontWeight: "bold",
    },
  },
  {
    value: "heading-2" as const,
    label: "Heading 2",
    type: "heading" as const,
    as: "h2" as const,
    style: {
      fontSize: convertRemToPx(1.5),
      fontWeight: "bold",
    },
  },
  {
    value: "heading-3" as const,
    label: "Heading 3",
    type: "heading" as const,
    as: "h3" as const,
    style: {
      fontSize: convertRemToPx(1.25),
      fontWeight: "bold",
    },
  },
];

function Toolbar({ element }: { element: ParagraphElement }) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const toolbar = useRef<HTMLFormElement | null>(null);

  const onChange = (
    field: keyof ParagraphElement,
    value: ParagraphElement[keyof ParagraphElement],
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
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Select
        className="row-start-1 col-span-3"
        name="type"
        defaultValue={OPTIONS.find((option) => option.type === "paragraph")}
        options={OPTIONS}
        onChange={(option) => {
          if (option) {
            if (option.value === "paragraph") {
              return Transforms.setNodes(
                editor,
                { type: option.type, style: option.style },
                { at },
              );
            }

            return Transforms.setNodes(
              editor,
              { type: option.type, as: option.as, style: option.style },
              { at },
            );
          }
        }}
      />

      <Input
        prefix={<ALargeSmall className="w-4 h-4" />}
        type="number"
        name="fontSize"
        className="col-span-3 row-start-2"
        value={getCSSValueWithoutUnit(
          get(element, "style.fontSize", "14").toString(),
        )}
        onChange={(e) =>
          onChange("style", {
            ...(element.style || {}),
            fontSize: `${e.target.value}px`,
          })
        }
        min={12}
      />

      <Input
        prefix={<Space className="w-4 h-4" />}
        type="number"
        name="letterSpacing"
        className="col-span-3 row-start-2"
        value={getCSSValueWithoutUnit(
          get(element, "style.letterSpacing", "0").toString(),
        )}
        onChange={(e) =>
          onChange("style", {
            ...(element.style || {}),
            letterSpacing: `${e.target.value}px`,
          })
        }
        min={0}
      />

      <Toggle
        className="row-start-2"
        variant="outline"
        pressed={get(element, "style.fontWeight", "normal") === "bold"}
        onPressedChange={() =>
          onChange("style", {
            ...(element.style || {}),
            fontWeight:
              element.style?.fontWeight === "bold" ? "normal" : "bold",
          })
        }
      >
        <Bold className="w-4 h-4" />
      </Toggle>

      <Toggle
        className="row-start-2"
        variant="outline"
        pressed={get(element, "style.fontStyle", "normal") === "italic"}
        onPressedChange={() =>
          onChange("style", {
            ...(element.style || {}),
            fontStyle:
              element.style?.fontStyle === "italic" ? "normal" : "italic",
          })
        }
      >
        <Italic className="w-4 h-4" />
      </Toggle>

      <Toggle
        className="row-start-2"
        variant="outline"
        pressed={get(element, "style.textDecoration", "none") === "underline"}
        onPressedChange={() =>
          onChange("style", {
            ...(element.style || {}),
            textDecoration:
              element.style?.textDecoration === "underline"
                ? "none"
                : "underline",
          })
        }
      >
        <Underline className="w-4 h-4" />
      </Toggle>

      <Toggle
        className="row-start-2"
        variant="outline"
        pressed={
          get(element, "style.textDecoration", "none") === "line-through"
        }
        onPressedChange={() =>
          onChange("style", {
            ...(element.style || {}),
            textDecoration:
              element.style?.textDecoration === "line-through"
                ? "none"
                : "line-through",
          })
        }
      >
        <Strikethrough className="w-4 h-4" />
      </Toggle>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button size="icon" variant="outline" className="row-start-2">
            <Baseline className="w-4 h-4" />
          </Button>
        </HoverCardTrigger>

        <HoverCardContent className="p-2 w-fit">
          <HexColorPicker
            color={get(element, "style.color", "000").toString()}
            onChange={(color) =>
              onChange("style", {
                ...(element.style || {}),
                color,
              })
            }
          />
        </HoverCardContent>
      </HoverCard>

      <Button
        size="icon"
        variant="outline"
        className="row-start-2"
        onClick={() =>
          onChange("style", {
            ...(element.style || {}),
            letterSpacing: "0",
            fontSize: "14px",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            color: "000",
          })
        }
      >
        <RemoveFormatting className="w-4 h-4" />
      </Button>
    </Form>
  );
}

export function renderToolbar(element: ParagraphElement) {
  return <Toolbar element={element} />;
}
