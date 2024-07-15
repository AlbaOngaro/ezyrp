import { OptimisticUpdate } from "convex/browser";
import {
  PaginatedQueryArgs,
  PaginatedQueryReference,
  ReactAction,
  ReactMutation,
  UsePaginatedQueryReturnType,
} from "convex/react";
import {
  FunctionArgs,
  FunctionReference,
  OptionalRestArgs,
  PaginationOptions,
} from "convex/server";

import { useEffect, useState } from "react";
import { convexMockServer } from "./server";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  const fn = async (...args: OptionalRestArgs<Mutation>) => {
    return await convexMockServer.mutation(mutation, ...args);
  };

  fn.withOptimisticUpdate = (_: OptimisticUpdate<FunctionArgs<Mutation>>) => {
    console.warn("withOptimisticUpdate is  not supported in mock server");
    return fn;
  };

  return fn;
}

function* generatePaginationId() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

const pagniationIdGenerator = generatePaginationId();

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
      id: pagniationIdGenerator.next().value as number,
      cursor,
      numItems,
    } as PaginationOptions;

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
  }, [numItems, status]);

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

export function useAction<Action extends FunctionReference<"action">>(
  action: Action,
): ReactAction<Action> {
  return (...args: OptionalRestArgs<Action>) =>
    convexMockServer.action(action, ...args);
}
