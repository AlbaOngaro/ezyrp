import { useMutation } from "lib/hooks/useMutation";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

export function useEvents() {
  const { data, error, status } = useQuery(api.events.list);

  const create = useMutation(api.events.create);
  const update = useMutation(api.events.update);
  const remove = useMutation(api.events.remove);

  return {
    data,
    error,
    isLoading: status === "pending",
    create,
    update,
    delete: remove,
  };
}
