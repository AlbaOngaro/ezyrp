import { FunctionReturnType } from "convex/server";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";

import { useAction } from "lib/hooks/useAction";

type Invoices = FunctionReturnType<typeof api.stripe.invoices.list>;
type Args = (typeof api.stripe.invoices.list)["_args"];

export function useGetStripeSubscriptionInvoices({
  subscription_id,
  limit,
}: Args) {
  const getInvoices = useAction(api.stripe.invoices.list);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Invoices | undefined>(undefined);

  const refetch = (args: Args) => getInvoices.revalidate(args);

  useEffect(() => {
    getInvoices({ subscription_id, limit })
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription_id, limit]);

  return {
    data,
    error,
    refetch,
    loading,
  };
}
