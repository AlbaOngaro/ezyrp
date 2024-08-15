import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";

import { useQuery } from "lib/hooks/useQuery";

export function useInvoices() {
  const { data, error, status } = useQuery(api.invoices.list);
  const [create] = useMutation(api.invoices.create);
  const [update] = useMutation(api.invoices.update);
  const [remove] = useMutation(api.invoices.remove);

  return {
    data,
    error,
    isLoading: status === "pending",
    create,
    update,
    delete: remove,
  };
}
