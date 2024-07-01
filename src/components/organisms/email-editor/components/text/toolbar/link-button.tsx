import { Form } from "@radix-ui/react-form";
import { CircleCheck, CircleX, Link } from "lucide-react";
import { useSlateWithV } from "slate-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Editor, Range, Transforms, Element, NodeEntry } from "slate";

import { LinkElement } from "types/slate";

import { getValidUuid } from "lib/utils/getValidUuid";

import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "components/atoms/popover";
import { Toggle } from "components/atoms/toggle";

export function LinkButton() {
  const { editor, v } = useSlateWithV();
  const link = useMemo<NodeEntry<LinkElement> | null>(() => {
    const [entry] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        Element.isElementType(n, "link"),
    });

    if (!entry) {
      return null;
    }

    return entry as NodeEntry<LinkElement>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, v]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (link) {
      Transforms.setNodes(editor, { href }, { at: link[1] });
      return;
    }

    if (
      Range.isRange(editor.selection) &&
      Range.isCollapsed(editor.selection)
    ) {
      Transforms.insertNodes(editor, {
        id: getValidUuid(),
        type: "link",
        href,
        children: [{ text: href }],
      });

      return;
    }

    Transforms.wrapNodes(
      editor,
      // With split: true children will be
      // populated automatically with the selection contents
      {
        id: getValidUuid(),
        type: "link",
        href,
        children: [],
      },
      { split: true },
    );
    Transforms.collapse(editor, { edge: "end" });
  };

  const onUnwrap = () => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        Element.isElementType(n, "link"),
    });
  };

  const [href, setHref] = useState(link ? link[0].href : "");

  useEffect(() => {
    setHref(link ? link[0].href : "");
  }, [link]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Toggle variant="outline" pressed>
          <Link className="w-4 h-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent side="top">
        <Form className="grid grid-cols-6 gap-2" onSubmit={onSubmit}>
          <Input
            className="col-span-4"
            name="href"
            placeholder="https://example.com"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            validations={{
              valueMissing: "URL is required",
            }}
          />
          <Button
            disabled={!link}
            type="button"
            size="icon"
            variant="destructive"
            onClick={onUnwrap}
          >
            <CircleX className="w-4 h-4" />
          </Button>
          <Button disabled={!href} type="submit" size="icon" variant="outline">
            <CircleCheck className="w-4 h-4" />
          </Button>
        </Form>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
}
