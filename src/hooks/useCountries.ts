import { useEffect, useState } from "react";
import { FunctionReturnType } from "convex/server";
import { api } from "convex/_generated/api";
import { useAction } from "lib/hooks/useAction";

export function useCountries() {
  const [data, setData] = useState<
    FunctionReturnType<typeof api.countries.list>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const listCountries = useAction(api.countries.list);

  useEffect(() => {
    setLoading(true);
    listCountries()
      .then((res) => {
        setData(res);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    error,
    loading,
  };
}
