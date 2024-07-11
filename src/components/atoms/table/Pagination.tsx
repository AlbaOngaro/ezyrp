import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";

type Props = {
  page: number;
  onNextClick: (page: number) => void;
  onPrevClick: (page: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
};

export function Pagination({ page, onNextClick, onPrevClick, status }: Props) {
  const map = useRef(new Map());
  const canLoadMore = map.current.get(page) === "CanLoadMore";

  useEffect(() => {
    if (
      status !== "LoadingMore" &&
      status !== "LoadingFirstPage" &&
      !map.current.has(page)
    ) {
      map.current.set(page, status);
    }
  }, [status, page]);

  return (
    <div className="flex flex-1 justify-between sm:justify-end">
      <button
        disabled={page - 1 <= 0}
        onClick={() => onPrevClick(page - 1 >= 0 ? page - 1 : page)}
        className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
        disabled={!canLoadMore}
        onClick={() => onNextClick(page + 1)}
        className="relative cursor-pointer inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
