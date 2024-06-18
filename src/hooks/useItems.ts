import { useQuery } from "convex-helpers/react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export function useItems() {
  const { data, error, status } = useQuery(api.items.list);

  const create = useMutation(api.items.create);
  const update = useMutation(api.items.update);
  const remove = useMutation(api.items.remove);

  return {
    data,
    error,
    create,
    loading: status === "pending",
    update,
    delete: remove,
  };
}
