import { ReactNode, useRef } from "react";
import { Trigger, Portal, Root } from "@radix-ui/react-context-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { get } from "lodash";

import { ContextMenu } from "../../organisms/context-menu/ContextMenu";
import { wrapWithRow } from "./utils";
import { Row, Props } from "./types";
import { cn } from "lib/utils/cn";
import { Checkbox } from "components/atoms/checkbox";

export function TableRowRenderer<R extends Row = Row>({
  withMultiSelect,
  selectedRows,
  setSelectedRows,
  columns,
  row,
  contextMenuItems = [],
}: Pick<Props<R>, "withMultiSelect" | "columns" | "contextMenuItems"> & {
  row: R;
  selectedRows: R[];
  setSelectedRows: (rows: R[]) => void;
}) {
  const tr = useRef<HTMLTableRowElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const selected = selectedRows.some((r) => r._id === row._id);

  const withContextMenu = !!contextMenuItems && contextMenuItems.length > 0;

  return (
    <Root>
      <Trigger disabled={!withContextMenu} asChild>
        <tr
          ref={tr}
          className={cn("hover:bg-gray-50 group", {
            "bg-gray-50": selectedRows.includes(row),
          })}
          data-testid="table-row"
        >
          {withMultiSelect && (
            <td className="relative w-12" data-testid="table-cell__checkbox">
              <Checkbox
                data-testid="table-cell__checkbox-input"
                checked={selected}
                onChange={() => {
                  const newRows = selected
                    ? selectedRows.filter((r) => r !== row)
                    : [...selectedRows, row];

                  setSelectedRows(newRows);
                }}
              />
            </td>
          )}

          {columns.map(({ field, render }, index) => (
            <td
              key={field}
              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
              data-testid={`table-cell__${field}`}
            >
              {typeof render === "function"
                ? render(row, index)
                : (get(row, field, null) as ReactNode)}
            </td>
          ))}

          {withContextMenu && (
            <td className="w-12">
              <button
                className="flex justify-center items-center mx-auto p-2 text-gray-700 rounded-md transition-colors duration-300 hover:bg-gray-200"
                ref={button}
                onClick={() => {
                  tr.current?.dispatchEvent(
                    new MouseEvent("contextmenu", {
                      bubbles: true,
                      clientX: button.current?.getBoundingClientRect().x,
                      clientY: button.current?.getBoundingClientRect().y,
                    }),
                  );
                }}
              >
                <DotsVerticalIcon />
              </button>
            </td>
          )}
        </tr>
      </Trigger>

      <Portal>
        <ContextMenu
          items={contextMenuItems.map((item) => wrapWithRow(item, row))}
        />
      </Portal>
    </Root>
  );
}
