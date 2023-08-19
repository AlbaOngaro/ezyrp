import { Customer } from "lib/types";
import { getCustomers } from "requests/customers";
import useSWR from "swr";

export function useCustomers() {
  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Customer[], unknown, "/api/customers">(
    "/api/customers",
    getCustomers,
  );

  return {
    customers: data,
    error,
    isLoading,
    mutate,
  };
}
