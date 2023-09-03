import { useQuery } from "@apollo/client";

import { COUNTRIES } from "lib/queries/COUNTRIES";

export function useCountries() {
  const { data, error, loading: isLoading } = useQuery(COUNTRIES);

  return {
    data,
    error,
    isLoading,
  };
}
