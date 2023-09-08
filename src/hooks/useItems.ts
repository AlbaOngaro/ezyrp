import { useQuery } from "@apollo/client";
import { ITEMS } from "lib/queries/ITEMS";

export function useItems() {
  const { data, error, loading, refetch } = useQuery(ITEMS);

  return {
    data,
    error,
    loading,
    refetch,
  };
}
