import { SeparatorHorizontal } from "lucide-react";
import { DraggableWrapper } from "./draggable-wrapper";
import { Card } from "components/atoms/card";
import { HrElement } from "types/slate";

type Props = {
  disabled?: boolean;
};

const DRAGGABLE_HR_ID = "draggable-hr";
const DATA = {
  id: DRAGGABLE_HR_ID,
  type: "hr",
  children: [{ text: "" }],
} satisfies HrElement;

export function DraggableSeparator({ disabled }: Props) {
  return (
    <DraggableWrapper id={DRAGGABLE_HR_ID} disabled={disabled} data={DATA}>
      {({ ref, transform, listeners, attributes }) => (
        <Card
          className="p-2 aspect-square w-full max-w-[12rem] flex flex-col justify-center items-center"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          <SeparatorHorizontal className="w-12 h-12" />
          Divider
        </Card>
      )}
    </DraggableWrapper>
  );
}
