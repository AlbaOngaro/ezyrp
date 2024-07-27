import {
  PaginatedQueryArgs,
  PaginatedQueryReference,
  UsePaginatedQueryReturnType,
} from "convex/react";
import { PaginationOptions } from "convex/server";
import { useEffect, useState } from "react";
import { convexMockServer } from "__tests__/__mocks__/convex/server";

export function usePaginatedQuery<Query extends PaginatedQueryReference>(
  query: Query,
  args: PaginatedQueryArgs<Query> | "skip",
  options: { initialNumItems: number },
): UsePaginatedQueryReturnType<Query> {
  const [results, setResults] = useState<
    UsePaginatedQueryReturnType<Query>["results"]
  >([]);
  const [status, setStatus] =
    useState<UsePaginatedQueryReturnType<Query>["status"]>("LoadingFirstPage");

  const [numItems, setNumItems] = useState(options.initialNumItems);
  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    const skip = args === "skip";

    if (skip || !["LoadingFirstPage", "LoadingMore"].includes(status)) {
      return;
    }

    const argsObject = skip ? {} : args;

    const paginationOpts = {
      cursor,
      numItems,
    } satisfies PaginationOptions;

    const queryArgs = {
      ...argsObject,
      paginationOpts,
    };

    convexMockServer
      .query(
        query,
        // @ts-ignore
        queryArgs,
      )
      .then((res) => {
        setResults(res.page);
        setCursor(res.continueCursor);
        setStatus(res.isDone ? "Exhausted" : "CanLoadMore");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numItems, status, JSON.stringify(args)]);

  useEffect(() => {
    setStatus("LoadingFirstPage");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)]);

  switch (status) {
    case "LoadingMore":
    case "LoadingFirstPage":
      return {
        results,
        isLoading: true,
        loadMore: () => undefined,
        status,
      };
    case "CanLoadMore":
      return {
        results,
        isLoading: false,
        loadMore: (num: number) => {
          setStatus("LoadingMore");
          setNumItems(num);
        },
        status,
      };
    case "Exhausted":
      return {
        results,
        isLoading: false,
        loadMore: () => undefined,
        status,
      };
    default:
      throw new Error("Invalid status");
  }
}
