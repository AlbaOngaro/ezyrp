import { PropsWithChildren } from "react";

import { Columns2 } from "lucide-react";
import { DraggableWrapper } from "./draggable-wrapper";
import { RowElement } from "types/slate";
import { Card } from "components/atoms/card";
import { getValidUuid } from "lib/utils/getValidUuid";

type Props = PropsWithChildren<{
  disabled?: boolean;
}>;

const DRAGGABLE_ID = "draggable-columns";
const DATA = {
  id: DRAGGABLE_ID,
  type: "row",
  columns: [
    {
      id: getValidUuid(),
      type: "column",
      width: 50,
      children: [
        {
          id: getValidUuid(),
          type: "paragraph",
          children: [{ text: "Column 1" }],
        },
      ],
    },
    {
      id: getValidUuid(),
      width: 50,
      type: "column",
      children: [
        {
          id: getValidUuid(),
          type: "paragraph",
          children: [{ text: "Column 2" }],
        },
      ],
    },
  ],
  children: [{ text: "" }],
} satisfies RowElement;

export function DraggableColumns({ disabled }: Props) {
  return (
    <DraggableWrapper id={DRAGGABLE_ID} disabled={disabled} data={DATA}>
      {({ transform, attributes, listeners, ref }) => (
        <Card
          className="p-2 aspect-square w-full max-w-[12rem] flex flex-col justify-center items-center"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          <Columns2 className="w-12 h-12" />
          Columns
        </Card>
      )}
    </DraggableWrapper>
  );
}
