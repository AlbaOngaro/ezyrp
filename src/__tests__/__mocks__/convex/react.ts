import { OptimisticUpdate } from "convex/browser";
import { ReactAction, ReactMutation } from "convex/react";
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

  fn.withOptimisticUpdate = (_: OptimisticUpdate<FunctionArgs<Mutation>>) => {
    console.warn("withOptimisticUpdate is  not supported in mock server");
    return fn;
  };

  return fn;
}

export function useAction<Action extends FunctionReference<"action">>(
  action: Action,
): ReactAction<Action> {
  return (...args: OptionalRestArgs<Action>) =>
    convexMockServer.action(action, ...args);
}
