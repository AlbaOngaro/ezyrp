import { OptimisticUpdate } from "convex/browser";
import { ReactMutation } from "convex/react";
import {
  FunctionArgs,
  FunctionReference,
  OptionalRestArgs,
} from "convex/server";

import { convexMockServer } from "./server";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  const fn = (...args: OptionalRestArgs<Mutation>) => {
    return convexMockServer.mutation(mutation, ...args);
  };
  fn.withOptimisticUpdate = (
    _optimisticUpdate: OptimisticUpdate<FunctionArgs<Mutation>>,
  ) => {
    return fn;
  };

  return fn;
}
