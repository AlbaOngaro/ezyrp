import { FunctionReturnType } from "convex/server";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";
import { useAction } from "lib/hooks/useAction";

type Subscriptions = FunctionReturnType<typeof api.stripe.subscriptions.list>;

export function useGetStripeSubscriptions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Subscriptions | undefined>(undefined);

  const getStripeSubscriptions = useAction(api.stripe.subscriptions.list);

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await getStripeSubscriptions.revalidate();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStripeSubscriptions()
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    error,
    refetch,
    loading,
  };
}
