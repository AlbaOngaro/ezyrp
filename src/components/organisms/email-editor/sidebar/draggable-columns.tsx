import { PropsWithChildren } from "react";
import { v4 as uuid } from "uuid";

import { Columns2 } from "lucide-react";
import { DraggableWrapper } from "./draggable-wrapper";
import { RowElement } from "types/slate";
import { Card } from "components/atoms/card";

type Props = PropsWithChildren<{
  disabled?: boolean;
}>;

const DRAGGABLE_ID = "draggable-columns";
const DATA = {
  id: DRAGGABLE_ID,
  type: "row",
  children: [
    {
      id: uuid(),
      type: "column",
      children: [
        { id: uuid(), type: "paragraph", children: [{ text: "Column 1" }] },
      ],
    },
    {
      id: uuid(),
      type: "column",
      children: [
        { id: uuid(), type: "paragraph", children: [{ text: "Column 2" }] },
      ],
    },
  ],
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
