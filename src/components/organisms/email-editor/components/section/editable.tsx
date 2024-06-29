import { forwardRef, TextareaHTMLAttributes } from "react";
import { EditableProps } from "slate-react/dist/components/editable";

type Props = Omit<EditableProps, "onChange" | "id"> &
  TextareaHTMLAttributes<HTMLTableDataCellElement> & {
    id: string;
  };

export const Editable = forwardRef<HTMLTableDataCellElement, Props>(
  function Editable({ children, id, ...rest }, ref) {
    return (
      <td {...rest} ref={ref}>
        {children}
      </td>
    );
  },
);
