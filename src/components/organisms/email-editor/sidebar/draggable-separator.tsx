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
          className="bg-gray-100 rounded-sm p-4 flex flex-col gap-2 justify-start items-start cursor-pointer"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        >
          <SeparatorHorizontal className="h-6 w-6" />
          Divider
        </Card>
      )}
    </DraggableWrapper>
  );
}
