import {
  PaginatedQueryArgs,
  PaginatedQueryReference,
  UsePaginatedQueryReturnType,
} from "convex/react";
import { useEffect, useState } from "react";
import { PaginationOptions } from "convex/server";
import { useLazyQuery } from "../useLazyQuery";

type Status = "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";

export function usePaginatedQuery<Query extends PaginatedQueryReference>(
  query: Query,
  args: PaginatedQueryArgs<Query> | "skip",
  { initialNumItems }: { initialNumItems: number },
): UsePaginatedQueryReturnType<Query> {
  const [status, setStatus] = useState<Status>("LoadingFirstPage" as const);
  const [numItems, setNumItems] = useState(initialNumItems);
  const [cursor, setCursor] = useState<string | null>(null);

  const [loadQuery, { data }] = useLazyQuery(query);

  useEffect(() => {
    setStatus("LoadingFirstPage");
    setCursor(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  useEffect(() => {
    const skip = args === "skip";

    if (skip || !["LoadingFirstPage", "LoadingMore"].includes(status)) {
      return;
    }

    const argsObject = args ?? {};

    const paginationOpts = {
      cursor,
      numItems,
    } satisfies PaginationOptions;

    const queryArgs = {
      ...argsObject,
      paginationOpts,
    };

    loadQuery(queryArgs).then((res) => {
      setCursor(res.continueCursor);
      setStatus(res.isDone ? "Exhausted" : "CanLoadMore");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numItems, status]);

  switch (status) {
    case "LoadingMore":
    case "LoadingFirstPage":
      return {
        results: data?.page,
        isLoading: true,
        loadMore: () => undefined,
        status,
      };
    case "CanLoadMore":
      return {
        results: data?.page,
        isLoading: false,
        loadMore: (num: number) => {
          setStatus("LoadingMore");
          setNumItems(num);
        },
        status,
      };
    case "Exhausted":
      return {
        results: data?.page,
        isLoading: false,
        loadMore: () => undefined,
        status,
      };
    default:
      throw new Error("Invalid status");
  }
}
