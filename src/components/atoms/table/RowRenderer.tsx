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
  withContextMenu,
  withMultiSelect,
  selectedRows,
  setSelectedRows,
  columns,
  row,
  contextMenuItems = [],
}: Pick<
  Props<R>,
  "withContextMenu" | "withMultiSelect" | "columns" | "contextMenuItems"
> & {
  row: R;
  selectedRows: R[];
  setSelectedRows: (rows: R[]) => void;
}) {
  const button = useRef<HTMLButtonElement | null>(null);
  const tr = useRef<HTMLTableRowElement | null>(null);

  return (
    <Root>
      <Trigger disabled={!withContextMenu} asChild>
        <tr
          ref={tr}
          className={cn("hover:bg-gray-50 group", {
            "bg-gray-50": selectedRows.includes(row),
          })}
        >
          {withMultiSelect && (
            <td className="relative px-7 sm:w-12 sm:px-6">
              <Checkbox
                checked={selectedRows.includes(row)}
                onChange={(e) =>
                  setSelectedRows(
                    e.target.checked
                      ? [...selectedRows, row]
                      : selectedRows.filter((r) => r !== row),
                  )
                }
              />
            </td>
          )}

          {columns.map(({ field, render }, index) => (
            <td
              key={field}
              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
            >
              {typeof render === "function"
                ? render(row, index)
                : (get(row, field, null) as ReactNode)}
            </td>
          ))}

          {withContextMenu && (
            <td>
              <button
                className="flex justify-center items-center p-2 text-gray-700 rounded-md transition-colors duration-300 hover:bg-gray-200"
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
