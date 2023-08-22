import useSWR from "swr";
import { Invoice } from "lib/types";

async function getInvoices() {
  return fetch("/api/invoices").then((res) => res.json());
}

export function useInvoices() {
  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Invoice[], unknown, "/api/invoices">("/api/invoices", getInvoices);

  return {
    data,
    error,
    isLoading,
    create: (invoices: Omit<Invoice, "id" | "workspace">[]) =>
      mutate(() => {
        fetch("/api/invoices", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(
            invoices.map((invoice) => ({
              ...invoice,
              items: invoice.items.map((item) => ({
                ...item,
                price: item.price * 100,
              })),
            })),
          ),
        }).then((res) => res.json());

        return getInvoices();
      }),
    read: () => mutate(() => getInvoices()),
    update: (
      customers: Partial<Omit<Invoice, "workspace">> & { id: Invoice["id"] }[],
    ) =>
      mutate(() => {
        fetch("/api/invoices", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(customers),
        });

        return getInvoices();
      }),
    delete: (ids: Invoice["id"][]) =>
      mutate(async () => {
        await fetch("/api/invoices", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(ids),
        });

        return getInvoices();
      }),
  };
}
