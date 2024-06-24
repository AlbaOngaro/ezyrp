import { DraggableWrapper } from "./draggable-wrapper";
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
        <hr
          className="p-2 aspect-square w-full max-w-[12rem] flex justify-center items-center"
          ref={ref}
          style={{
            transform,
          }}
          {...listeners}
          {...attributes}
        />
      )}
    </DraggableWrapper>
  );
}
