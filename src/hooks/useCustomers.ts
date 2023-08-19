import { Customer } from "lib/types";
import useSWR from "swr";

async function getCustomers() {
  return fetch("/api/customers").then((res) => res.json());
}

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
    data,
    error,
    isLoading,
    create: (customers: Omit<Customer, "id">[]) =>
      mutate(() => {
        fetch("/api/customers", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(customers),
        }).then((res) => res.json());

        return getCustomers();
      }),
    read: () => mutate(() => getCustomers()),
    update: (customers: Partial<Customer> & { id: Customer["id"] }[]) =>
      mutate(() => {
        fetch("/api/customers", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(customers),
        });

        return getCustomers();
      }),
    delete: (ids: Customer["id"][]) =>
      mutate(async () => {
        await fetch("/api/customers", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(ids),
        });

        return getCustomers();
      }),
  };
}
