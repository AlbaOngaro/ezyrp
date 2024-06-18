import { useQuery } from "convex-helpers/react";
import { useMutation } from "convex/react";

import { api } from "convex/_generated/api";

export function useEventTypes() {
  const { data, status } = useQuery(api.eventTypes.list);

  const create = useMutation(api.eventTypes.create);
  const update = useMutation(api.eventTypes.update);
  const remove = useMutation(api.eventTypes.remove);

  return {
    data,
    loading: status === "pending",
    create,
    update,
    delete: remove,
  };
}
