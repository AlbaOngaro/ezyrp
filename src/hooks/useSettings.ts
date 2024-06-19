import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

export function useSettings() {
  const { data, status } = useQuery(api.settings.get);

  return {
    data,
    loading: status === "pending",
  };
}
