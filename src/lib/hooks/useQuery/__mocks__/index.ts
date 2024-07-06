import { OptionalRestArgsOrSkip } from "convex/react";
import { FunctionReference } from "convex/server";
import { useEffect, useState } from "react";
import { convexMockServer } from "__tests__/__mocks__/convex/server";

export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...[args]: OptionalRestArgsOrSkip<Query>
) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (args === "skip") {
      return;
    }

    convexMockServer
      .query(query, args)
      .then((res) => {
        setData(res);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [args, query]);

  return {
    data,
    error,
    status,
  };
}
