import { useQuery } from "@apollo/client";
import { SETTINGS } from "lib/queries/SETTINGS";

export function useSettings() {
  const { data, loading } = useQuery(SETTINGS);

  return {
    data,
    loading,
  };
}
