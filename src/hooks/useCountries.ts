import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";

export function useCountries() {
  const { data, error, status } = useQuery(api.countries.list, {});

  return {
    data,
    error,
    isLoading: status === "pending",
  };
}
