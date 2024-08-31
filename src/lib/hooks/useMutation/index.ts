import {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import { ReactMutation, useMutation as useConvexMutation } from "convex/react";
import { useState } from "react";
import { OptimisticUpdate } from "convex/browser";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): [ReactMutation<Mutation>, { loading: boolean; error: Error | null }] {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = useConvexMutation(mutation);

  const fn = async (
    args: OptionalRestArgs<Mutation>[number],
  ): Promise<FunctionReturnType<Mutation>> => {
    try {
      setLoading(true);
      return await mutate(args);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  fn.withOptimisticUpdate = (
    optimisticUpdate: OptimisticUpdate<FunctionArgs<Mutation>>,
  ) => {
    return mutate.withOptimisticUpdate(optimisticUpdate);
  };

  // @ts-ignore
  return [fn, { loading, error }];
}
