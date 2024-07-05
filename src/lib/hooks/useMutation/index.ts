import { FunctionReference, getFunctionName } from "convex/server";
import { ReactMutation, useMutation as useConvexMutation } from "convex/react";

import { useContext } from "react";
import { ConvexMocksContext } from "providers/convex-mocks-provider";

function fallback(name: string) {
  return () => {
    console.error("No mock found for this mutation", name);
  };
}

export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
): ReactMutation<Mutation> {
  const { mocks } = useContext(ConvexMocksContext);
  const convexmutation = useConvexMutation(mutation);

  if (process.env.NODE_ENV !== "test") {
    return convexmutation;
  }

  return (
    mocks.get(getFunctionName(mutation)) || fallback(getFunctionName(mutation))
  );
}
