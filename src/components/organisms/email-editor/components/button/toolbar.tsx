import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { Form } from "@radix-ui/react-form";
import { get } from "lodash";
import {
  ALargeSmall,
  Baseline,
  Bold,
  Italic,
  Link,
  RemoveFormatting,
  Space,
  Strikethrough,
  Underline,
  Unlink,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useRef } from "react";

import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { ButtonElement } from "types/slate";
import { getCSSValueWithoutUnit } from "lib/utils/getCSSValueWithoutUnit";
import { Input } from "components/atoms/input";
import { Button } from "components/atoms/button";
import { Toggle } from "components/atoms/toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/atoms/hover-card";

function Toolbar({ element }: { element: ButtonElement }) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const toolbar = useRef<HTMLFormElement | null>(null);

  const onChange = (
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
      <Input
        prefix={<Link className="w-4 h-4" />}
        name="href"
        className="col-span-11"
        value={element.href}
        placeholder="https://example.com"
        onChange={(e) => onChange("href", e.target.value)}
      />

      <Button
        size="icon"
        variant="destructive"
        disabled={!element.href}
        onClick={() => onChange("href", "")}
      >
        <Unlink className="w-4 h-4" />
      </Button>

      <Input
        prefix={<ALargeSmall className="w-4 h-4" />}
        type="number"
        name="fontSize"
        className="col-span-3"
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
        className="col-span-3"
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
          <Button size="icon" variant="outline">
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

export function renderToolbar(element: ButtonElement) {
  return <Toolbar element={element} />;
}
