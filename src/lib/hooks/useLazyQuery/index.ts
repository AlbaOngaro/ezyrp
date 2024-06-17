import { useQuery } from "convex-helpers/react";
import { FunctionReference } from "convex/server";
import { useState } from "react";

import { Args, ReturnTuple } from "./types";

export function useLazyQuery<Query extends FunctionReference<"query">>(
  query: Query,
): ReturnTuple<Query> {
  const [args, setArgs] = useState<Args<Query>>("skip");

  const { status, data, error } = useQuery(query, args);

  const execute = async (args?: Args<Query>) => {
    setArgs(args);
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        switch (status) {
          case "success":
            clearInterval(interval);
            return resolve(data);
          case "error":
            clearInterval(interval);
            return reject(error);
        }
      }, 100);
    });
  };

  return [execute, { loading: status === "pending", data, error }];
}
