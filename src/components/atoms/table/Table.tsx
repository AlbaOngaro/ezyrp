import { ReactNode, useLayoutEffect, useRef, useState } from "react";

import { useCustomers } from "hooks/useCustomers";
import { Customer } from "lib/types";
import { twMerge } from "lib/utils/twMerge";

interface Row extends Record<string, ReactNode> {
  id: string;
}

export interface Column<R extends Row = Row> {
  id: string;
  field: Extract<keyof R, string>;
  headerName?: string;
}

interface Props<R extends Row = Row> {
  className?: string;
  columns: Column<R>[];
  rows: R[];
  withMultiSelect?: boolean;
}

export function Table<R extends Row = Row>({
  className,
  columns,
  rows,
  withMultiSelect,
}: Props<R>) {
  const [checked, setChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState<R[]>([]);

  function toggleAll() {
    setSelectedRows(checked ? [] : rows);
    setChecked((curr) => !curr);
  }

  return (
    <div className={twMerge("flow-root", className)}>
      <table className="min-w-full table-fixed divide-y divide-gray-300">
        <thead>
          <tr>
            {withMultiSelect && (
              <th className="relative px-7 sm:w-12 sm:px-6">
                <input
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  type="checkbox"
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
                {column.headerName || column.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map((row) => (
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
                      setSelectedRows((curr) =>
                        e.target.checked
                          ? [...curr, row]
                          : curr.filter((r) => r !== row),
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
      </table>
    </div>
  );
}
