import { useQuery } from "convex-helpers/react";
import { FunctionReference, FunctionReturnType } from "convex/server";
import { useEffect, useRef, useState } from "react";

import { Args, ReturnTuple } from "./types";

type PromiseResolve<Query extends FunctionReference<"query">> = (
  value: FunctionReturnType<Query>,
) => void;

type PromiseReject = (error: Error) => void;

export function useLazyQuery<Query extends FunctionReference<"query">>(
  query: Query,
): ReturnTuple<Query> {
  const promiseResolve = useRef<PromiseResolve<Query> | null>(null);
  const promiseReject = useRef<PromiseReject | null>(null);

  const [args, setArgs] = useState<Args<Query>>("skip");

  const { status, data, error } = useQuery(query, args);

  useEffect(() => {
    switch (status) {
      case "success":
        promiseResolve?.current?.call(undefined, data);
        break;
      case "error":
        promiseReject?.current?.call(undefined, error);
        break;
    }
  }, [status, promiseResolve, promiseReject]);

  const execute = async (args?: Args<Query>) => {
    setArgs(args);
    return new Promise<FunctionReturnType<Query>>((resolve, reject) => {
      promiseResolve.current = resolve;
      promiseReject.current = reject;
    });
  };

  return [execute, { loading: status === "pending", data, error }];
}
