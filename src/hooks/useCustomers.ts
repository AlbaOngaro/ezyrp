import { useMutation } from "lib/hooks/useMutation";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

export function useCustomers() {
  const { data, error, status } = useQuery(api.customers.list);

  const create = useMutation(api.customers.create);
  const update = useMutation(api.customers.update);
  const remove = useMutation(api.customers.remove);

  return {
    data,
    error,
    isLoading: status === "pending",
    create,
    update,
    delete: remove,
  };
}
