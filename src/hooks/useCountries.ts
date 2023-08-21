import useSWR from "swr";
import { Country } from "lib/types";

export function useCountries() {
  const { data, error, isLoading } = useSWR<
    Country[],
    unknown,
    "/api/countries"
  >("/api/countries", () =>
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((countries: Country[]) =>
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
      ),
  );

  return {
    data,
    error,
    isLoading,
  };
}
