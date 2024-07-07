import { FunctionReference } from "convex/server";
import { ReactMutation, useMutation as useConvexMutation } from "convex/react";

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  return useConvexMutation(mutation);
}
