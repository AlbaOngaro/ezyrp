import { Customer } from "lib/types";
import useSWR from "swr";

export function useCustomers() {
  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Customer[], unknown, "/api/customers">("/api/customers", () =>
    fetch("/api/customers").then((res) => res.json() as Promise<Customer[]>),
  );

  return {
    customers: data,
    error,
    isLoading,
    mutate,
  };
}
