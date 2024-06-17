import { OptionalRestArgsOrSkip } from "convex/react";
import { FunctionReference, FunctionReturnType } from "convex/server";

export type Args<Query extends FunctionReference<"query">> =
  OptionalRestArgsOrSkip<Query>[0];

export type ReturnFn<Query extends FunctionReference<"query">> = (
  args?: Args<Query>,
) => Promise<FunctionReturnType<Query>>;

export type ReturnObj<Query extends FunctionReference<"query">> = {
  loading: boolean;
  data: FunctionReturnType<Query>;
  error?: Error;
};

export type ReturnTuple<Query extends FunctionReference<"query">> = [
  ReturnFn<Query>,
  ReturnObj<Query>,
];
