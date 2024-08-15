import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";

export function useItems() {
  const { data, status, error } = useQuery(api.items.list);
  const [create] = useMutation(api.items.create);
  const [update] = useMutation(api.items.update);
  const [remove] = useMutation(api.items.remove);

  return {
    status,
    data,
    error,
    isLoading: status === "pending",
    create,
    update,
    delete: remove,
  };
}
