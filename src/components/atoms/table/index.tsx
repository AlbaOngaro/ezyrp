import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
} from "@radix-ui/react-icons";

import { Props, Row, Sort } from "./types";
import { TableRowRenderer } from "./RowRenderer";
import { Pagination } from "./Pagination";
import { cn } from "lib/utils/cn";
import { Checkbox } from "components/atoms/checkbox";

export function Table<R extends Row = Row>({
  className,
  columns,
  rows,
  withMultiSelect,
  onSelect,
  renderSelectedActions,
  withContextMenu,
  contextMenuItems,
  withPagination,
  pagination,
  loading,
}: Props<R>) {
  const checkbox = useRef<HTMLInputElement | null>(null);

  const [checked, setChecked] = useState(false);
  const [selectedRows, _setSelectedRows] = useState<R[]>([]);
  const [sort, setSort] = useState<Sort<R> | null>(null);

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

  const getColSpan = () => {
    if (!withMultiSelect && !withContextMenu) {
      return columns.length;
    }

    if (withMultiSelect && withContextMenu) {
      return columns.length + 2;
    }

    return columns.length + 1;
  };

  return (
    <div className={cn("flow-root relative", className)}>
      {selectedRows.length > 0 && renderSelectedActions && (
        <div className="absolute left-[3.5rem] top-0 flex h-12 items-center space-x-3 bg-white">
          {renderSelectedActions(selectedRows)}
        </div>
      )}
      <table className={cn("min-w-full table-fixed divide-y divide-gray-300")}>
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
                      disabled={loading}
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
                      className="ml-2 flex-none rounded bg-gray-100 text-gray-900 transition-colors duration-300 group-hover:bg-gray-200 group-hover:disabled:bg-gray-100 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {!sort || sort.field !== column.field ? (
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

        <tbody
          className={cn("divide-y divide-gray-200 bg-white", {
            "relative after:content-[''] after:bg-[url('/images/loader.svg')] after:bg-no-repeat after:bg-center after:bg-[size:30px_30px] after:absolute after:flex after:justify-center after:items-center after:w-full after:h-full after:inset-0 after:bg-white/70":
              loading,
          })}
        >
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
            .map((row) => (
              <TableRowRenderer
                key={row._id}
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
            <td colSpan={getColSpan()}>
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
                      Showing <strong>{rows.length}</strong> of{" "}
                      {pagination?.total || rows.length} results
                    </p>
                  )}
                </div>

                {withPagination && (
                  <Pagination
                    initialPage={pagination?.initialPage}
                    pageSize={pagination?.pageSize}
                    total={pagination?.total || 0}
                    onPageChange={pagination?.onPageChange || console.debug}
                  />
                )}
              </nav>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
