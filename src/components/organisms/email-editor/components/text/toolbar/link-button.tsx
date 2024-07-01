import { Form } from "@radix-ui/react-form";
import { Link } from "lucide-react";
import { useSlate } from "slate-react";
import { FormEvent } from "react";
import { Range, Transforms, Element, Editor, Text } from "slate";

import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "components/atoms/popover";
import { getValidUuid } from "lib/utils/getValidUuid";

export function LinkButton() {
  const editor = useSlate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const href = formData.get("href") as string;

    if (!href) {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <Link className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top">
        <Form className="flex flex-row gap-2" onSubmit={onSubmit}>
          <Input name="href" placeholder="https://example.com" />
          <Button>add</Button>
        </Form>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
}
