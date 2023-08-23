import { ReactNode, useEffect, useRef, useState } from "react";
import { get } from "lodash";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MinusIcon,
} from "@radix-ui/react-icons";
import { Trigger, Portal, Root } from "@radix-ui/react-context-menu";

import { Props, Row, Sort, TableContextMenuItem } from "./types";
import { twMerge } from "lib/utils/twMerge";

import { Checkbox } from "components/atoms/checkbox/Checkbox";
import { ContextMenu } from "components/organisms/context-menu/ContextMenu";

const DEFAULT_PAGE_SIZE = 10;

function wrapWithRow<R extends Row = Row>(
  item: TableContextMenuItem<R>,
  row: R,
): TableContextMenuItem<R> {
  return Object.entries(item).reduce<TableContextMenuItem<R>>(
    (acc, [key, value]) => {
      if (typeof value === "function") {
        return {
          ...acc,
          [key]: (...args: unknown[]) => value(row, ...args),
        };
      }

      if (Array.isArray(value)) {
        return {
          ...acc,
          [key]: value.map((entry) => wrapWithRow(entry, row)),
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    },
    {} as TableContextMenuItem<R>,
  );
}

function TableRowRenderer<R extends Row = Row>({
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
          className={twMerge("hover:bg-gray-50 group", {
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

          {columns.map(({ field, render }) => (
            <td
              key={field}
              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
            >
              {typeof render === "function"
                ? render(row)
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

export function Table<R extends Row = Row>({
  className,
  columns,
  rows,
  withMultiSelect,
  onSelect,
  pagination,
  renderSelectedActions,
  withContextMenu,
  contextMenuItems,
}: Props<R>) {
  const checkbox = useRef<HTMLInputElement | null>(null);

  const [checked, setChecked] = useState(false);
  const [selectedRows, _setSelectedRows] = useState<R[]>([]);
  const [page, setPage] = useState(pagination?.initialPage || 0);
  const [sort, setSort] = useState<Sort<R> | null>(null);

  const pageSize = pagination?.pageSize || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    if (selectedRows.length > 0 && selectedRows.length < rows.length) {
      if (checkbox.current) {
        checkbox.current.indeterminate = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  useEffect(() => {
    setSelectedRows([]);
    setChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const setSelectedRows = (rows: R[]) => {
    _setSelectedRows(rows);
    if (typeof onSelect === "function") {
      onSelect(rows);
    }
  };

  const toggleAll = () => {
    setSelectedRows(checked ? [] : rows);
    setChecked((curr) => !curr);
  };

  return (
    <div className={twMerge("flow-root relative", className)}>
      {selectedRows.length > 0 && renderSelectedActions && (
        <div className="absolute left-[6.5rem] top-0 flex h-12 items-center space-x-3 bg-white">
          {renderSelectedActions(selectedRows)}
        </div>
      )}
      <table className="min-w-full table-fixed divide-y divide-gray-300">
        <thead>
          <tr>
            {withMultiSelect && (
              <th className="relative px-7 sm:w-12 sm:px-6">
                <Checkbox
                  ref={checkbox}
                  checked={checked}
                  onChange={toggleAll}
                />
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                <span className="group inline-flex">
                  {column.headerName || column.field}
                  {column.sortable && (
                    <button
                      onClick={() =>
                        setSort((curr) => {
                          if (!curr) {
                            return {
                              field: column.field,
                              order: "ASC",
                            };
                          }

                          return {
                            field: column.field,
                            order: curr.order === "ASC" ? "DESC" : "ASC",
                          };
                        })
                      }
                      className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200 p-1"
                    >
                      {!sort ? (
                        <MinusIcon />
                      ) : sort.order === "ASC" ? (
                        <ChevronDownIcon />
                      ) : (
                        <ChevronUpIcon />
                      )}
                    </button>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {rows
            .sort((a, b) => {
              if (!sort) {
                return 0;
              }

              if (
                typeof a[sort.field] === "string" &&
                typeof b[sort.field] === "string"
              ) {
                if (sort.order === "ASC") {
                  return (a[sort.field] as string).localeCompare(
                    b[sort.field] as string,
                  );
                }

                return (b[sort.field] as string).localeCompare(
                  a[sort.field] as string,
                );
              }

              if (
                typeof a[sort.field] === "number" &&
                typeof b[sort.field] === "number"
              ) {
                if (sort.order === "ASC") {
                  return (a[sort.field] as number) - (b[sort.field] as number);
                }

                return (b[sort.field] as number) - (a[sort.field] as number);
              }

              return 0;
            })
            .slice(page * pageSize, (page + 1) * pageSize)
            .map((row) => (
              <TableRowRenderer
                key={row.id}
                row={row}
                withContextMenu={withContextMenu}
                withMultiSelect={withMultiSelect}
                columns={columns}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                contextMenuItems={contextMenuItems}
              />
            ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={withMultiSelect ? columns.length + 1 : columns.length}>
              <nav
                className="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  {withMultiSelect && selectedRows.length > 0 ? (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{selectedRows.length}</span>{" "}
                      rows elected
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{page * pageSize + 1}</span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {(page + 1) * pageSize <= rows.length
                          ? (page + 1) * pageSize
                          : rows.length}
                      </span>{" "}
                      of <span className="font-medium">{rows.length}</span>{" "}
                      results
                    </p>
                  )}
                </div>

                <div className="flex flex-1 justify-between sm:justify-end">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(0)}
                    className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <DoubleArrowLeftIcon className="h-5 w-5" />
                  </button>

                  <button
                    disabled={page === 0}
                    onClick={() =>
                      setPage((curr) => {
                        if (curr - 1 >= 0) {
                          return curr - 1;
                        }

                        return curr;
                      })
                    }
                    className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>

                  <button
                    disabled={page * pageSize >= rows.length}
                    onClick={() =>
                      setPage((curr) => {
                        if ((curr + 1) * pageSize < rows.length) {
                          return curr + 1;
                        }

                        return curr;
                      })
                    }
                    className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>

                  <button
                    disabled={page === (rows.length - pageSize) / pageSize}
                    onClick={() => setPage((rows.length - pageSize) / pageSize)}
                    className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <DoubleArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </nav>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
