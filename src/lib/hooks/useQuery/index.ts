import { OptionalRestArgsOrSkip, usePreloadedQuery } from "convex/react";
import { FunctionReference, getFunctionName } from "convex/server";
import { convexToJson } from "convex/values";
import { useContext } from "react";

import { ReturnType } from "./types";

import { ConvexCacheContext } from "providers/convex-cache";

export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args?: OptionalRestArgsOrSkip<Query>[0],
): ReturnType<Query> {
  const { cache } = useContext(ConvexCacheContext);

  const key = `${getFunctionName(query)}:${JSON.stringify(args || {})}`;
  const value = cache.get(key) || null;

  console.debug({
    cache,
    value,
    key,
  });

  const data = usePreloadedQuery<Query>({
    _name: getFunctionName(query),
    // @ts-ignore
    _argsJSON: convexToJson(args ?? {}),
    // @ts-ignore
    _valueJSON: convexToJson(value),
  });

  switch (true) {
    case args === "skip":
    case data === undefined:
    case data === null:
      return {
        status: "pending",
        data: undefined,
        error: undefined,
        isSuccess: false,
        isPending: true,
        isError: false,
      };
    case (data as unknown) instanceof Error:
      return {
        status: "error",
        data: undefined,
        error: data as Error,
        isSuccess: false,
        isPending: false,
        isError: true,
      };
    default: {
      cache.set(key, data);

      return {
        status: "success",
        data,
        error: undefined,
        isSuccess: true,
        isPending: false,
        isError: false,
      };
    }
  }
}
