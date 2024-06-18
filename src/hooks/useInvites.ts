import { useQuery } from "convex-helpers/react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export function useInvites() {
  const { data, status } = useQuery(api.invites.list);

  const create = useMutation(api.invites.create);

  return {
    data,
    loading: status === "pending",
    create,
  };
}
