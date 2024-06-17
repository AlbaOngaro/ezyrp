import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";

export function useSettings() {
  const { data, status } = useQuery(api.settings.get);

  return {
    data,
    loading: status === "pending",
  };
}
