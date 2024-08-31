import {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import { ReactMutation } from "convex/react";
import { useState } from "react";
import { OptimisticUpdate } from "convex/browser";
import { convexMockServer } from "__tests__/__mocks__/convex/server";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): [ReactMutation<Mutation>, { loading: boolean; error: Error | null }] {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fn = async (
    args: OptionalRestArgs<Mutation>[number],
  ): Promise<FunctionReturnType<Mutation>> => {
    try {
      setLoading(true);
      return await convexMockServer.mutation(mutation, args);
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
    _optimisticUpdate: OptimisticUpdate<FunctionArgs<Mutation>>,
  ) => {
    return Promise.reject();
  };

  // @ts-ignore
  return [fn, { loading, error }];
}
