import { ReactNode } from "react";

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
  rows: Row[];
}

export function Table<R extends Row = Row>({
  className,
  columns,
  rows,
}: Props<R>) {
  return (
    <div className={twMerge("mt-8 flow-root", className)}>
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    {column.headerName || column.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map(({ field }, idx) => (
                    <td
                      key={field}
                      className={twMerge(
                        "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell",
                        {
                          "border-b border-gray-200":
                            idx !== columns.length - 1,
                        },
                      )}
                    >
                      {row[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
