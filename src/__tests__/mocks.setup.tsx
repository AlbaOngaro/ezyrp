export const modules = import.meta.glob("../convex/**/!(*.*.*)*.*s");
import { convexTest } from "convex-test";
import { Preloaded, ReactMutation } from "convex/react";
import {
  FunctionArgs,
  FunctionReference,
  makeFunctionReference,
  OptionalRestArgs,
} from "convex/server";
import { OptimisticUpdate } from "convex/browser";
import { useEffect, useState } from "react";
import schema from "convex/schema";

const t = convexTest(schema, modules);
// @ts-ignore
export const tAuth = t.withIdentity({ websiteUrl: "test" });

export function usePreloadedQuery<Query extends FunctionReference<"query">>(
  preloadedQuery: Preloaded<Query>,
): Query["_returnType"] {
  const { _valueJSON, _name, _argsJSON } = preloadedQuery;

  const [data, setData] = useState(_valueJSON);

  useEffect(() => {
    const query = makeFunctionReference<"query">(_name);

    (async () => {
      const result = await tAuth.query(query, _argsJSON);
      setData(result);
    })();
  }, [_argsJSON, _name]);

  return data;
}

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  const fn = (...args: OptionalRestArgs<Mutation>) =>
    tAuth.mutation(mutation, ...args);
  fn.withOptimisticUpdate = (
    _optimisticUpdate: OptimisticUpdate<FunctionArgs<Mutation>>,
  ) => {
    return fn;
  };

  return fn;
}
