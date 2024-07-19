import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
} from "@radix-ui/react-icons";

import { Filter } from "lucide-react";
import { Skeleton } from "../skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Props, Row, Sort } from "./types";
import { TableRowRenderer } from "./RowRenderer";
import { Pagination } from "./Pagination";
import { cn } from "lib/utils/cn";
import { Checkbox } from "components/atoms/checkbox";
import { convertRemToPx } from "lib/utils/convertRemToPx";

export function Table<R extends Row = Row>({
  className,
  columns,
  rows: initialRows,
  withMultiSelect,
  onSelect,
  renderSelectedActions,
  contextMenuItems,
  pagination,
  loading,
  ...rest
}: Props<R>) {
  const checkbox = useRef<HTMLInputElement | null>(null);

  const [checked, setChecked] = useState(false);
  const [selectedRows, _setSelectedRows] = useState<R[]>([]);
  const [sort, setSort] = useState<Sort<R> | null>(null);
  const [page, setPage] = useState(1);

  const withContextMenu = !!contextMenuItems && contextMenuItems.length > 0;
  const withPagination = !!pagination;

  const rows = initialRows.slice(
    withPagination ? (page - 1) * pagination.pageSize : 0,
    withPagination
      ? (page - 1) * pagination.pageSize + pagination.pageSize
      : undefined,
  );

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
      <table
        className={cn("min-w-full table-fixed divide-y divide-gray-300")}
        {...rest}
      >
        <thead>
          <tr>
            {withMultiSelect && (
              <th
                className="relative px-7 sm:w-12 sm:px-6"
                data-testid="table-head__checkbox"
              >
                <Checkbox
                  data-testid="table-head__checkbox-input"
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
                style={{ width: column.width }}
                data-testid={column.testId}
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
                      className="ml-2 flex-none rounded bg-gray-100 text-gray-900 transition-colors duration-300 hover:bg-gray-200 group-hover:disabled:bg-gray-100 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                      data-testid={
                        column.testId ? `${column.testId}--sort-btn` : ""
                      }
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
                  {column.filterable && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          disabled={loading}
                          className="ml-2 w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-900 transition-colors duration-300 hover:bg-gray-200 group-hover:disabled:bg-gray-100 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                          data-testid={
                            column.testId ? `${column.testId}--filter-btn` : ""
                          }
                        >
                          <Filter className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        alignOffset={convertRemToPx(-1)}
                        align="start"
                      >
                        {column.filterComponent}
                      </PopoverContent>
                    </Popover>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className="divide-y divide-gray-200 bg-white"
          data-testid={rows.length === 0 ? "table-body--empty" : "table-body"}
        >
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {withMultiSelect && <td />}
                  {columns.map((col) => (
                    <td key={col.id} className="py-4 px-2">
                      <Skeleton as="p" className="h-4 w-full" />
                    </td>
                  ))}
                  {withContextMenu && <td />}
                </tr>
              ))}
            </>
          ) : (
            <>
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
                      return (
                        (a[sort.field] as number) - (b[sort.field] as number)
                      );
                    }

                    return (
                      (b[sort.field] as number) - (a[sort.field] as number)
                    );
                  }

                  return 0;
                })
                .map((row) => (
                  <TableRowRenderer
                    key={row._id}
                    row={row}
                    withMultiSelect={withMultiSelect}
                    columns={columns}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    contextMenuItems={contextMenuItems}
                  />
                ))}
            </>
          )}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={getColSpan()}>
              <nav
                className="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  {withMultiSelect && selectedRows.length > 0 && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{selectedRows.length}</span>{" "}
                      rows elected
                    </p>
                  )}
                </div>

                {withPagination && (
                  <Pagination
                    page={page}
                    onPrevClick={(p) => setPage(p)}
                    onNextClick={async (p) => {
                      setPage(p);
                      pagination.loadMore();
                    }}
                    status={pagination.status}
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
