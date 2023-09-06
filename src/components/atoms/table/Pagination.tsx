import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { useCallback, useState } from "react";
import { Pagination as PaginationI } from "./types";

export function Pagination({
  initialPage = 0,
  pageSize = 10,
  total,
  onPageChange,
}: PaginationI) {
  const [page, _setPage] = useState(initialPage);

  const setPage = useCallback(
    (page: number) => {
      _setPage(page);

      onPageChange({
        start: page * pageSize,
        limit: pageSize,
      });
    },
    [onPageChange, pageSize],
  );

  return (
    <div className="flex flex-1 justify-between sm:justify-end">
      <button
        disabled={page === 0}
        onClick={() => setPage(0)}
        className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <DoubleArrowLeftIcon className="h-5 w-5" />
      </button>

      <button
        disabled={page - 1 < 0}
        onClick={() => setPage(page - 1 >= 0 ? page - 1 : page)}
        className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
        disabled={(page + 1) * pageSize + pageSize > total}
        onClick={() => setPage((page + 1) * pageSize < total ? page + 1 : page)}
        className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <button
        disabled={page * pageSize + pageSize >= total}
        onClick={() => setPage((total - pageSize) / pageSize)}
        className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <DoubleArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
