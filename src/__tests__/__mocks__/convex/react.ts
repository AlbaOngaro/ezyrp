import { OptimisticUpdate } from "convex/browser";
import { ReactMutation } from "convex/react";
import {
  FunctionArgs,
  FunctionReference,
  OptionalRestArgs,
} from "convex/server";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  const fn = (...args: OptionalRestArgs<Mutation>) => {
    console.log("useMutationMock", mutation, args);
    // tAuth.mutation(mutation, ...args);
  };
  fn.withOptimisticUpdate = (
    _optimisticUpdate: OptimisticUpdate<FunctionArgs<Mutation>>,
  ) => {
    return fn;
  };

  return fn;
}
