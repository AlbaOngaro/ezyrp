import { useEffect, useRef, useState } from "react";

import { twMerge } from "lib/utils/twMerge";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MinusIcon,
} from "@radix-ui/react-icons";

import { Props, Row, Sort } from "./types";

const DEFAULT_PAGE_SIZE = 10;

export function Table<R extends Row = Row>({
  className,
  columns,
  rows,
  withMultiSelect,
  onSelect,
  pagination,
  renderSelectedActions,
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
                <input
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  type="checkbox"
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

              if (sort.order === "ASC") {
                return (a[sort.field] as string).localeCompare(
                  b[sort.field] as string,
                );
              }

              return (b[sort.field] as string).localeCompare(
                a[sort.field] as string,
              );
            })
            .slice(page * pageSize, (page + 1) * pageSize)
            .map((row) => (
              <tr
                key={row.id}
                className={twMerge({
                  "bg-gray-50": selectedRows.includes(row),
                })}
              >
                {withMultiSelect && (
                  <td className="relative px-7 sm:w-12 sm:px-6">
                    <input
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
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

                {columns.map(({ field }) => (
                  <td
                    key={field}
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                  >
                    {row[field]}
                  </td>
                ))}
              </tr>
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
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>

                  <button
                    disabled={page === (rows.length - pageSize) / pageSize}
                    onClick={() => setPage((rows.length - pageSize) / pageSize)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
