import { Customer } from "lib/types";

export async function createCustomers(customers: Omit<Customer, "id">[]) {
  return fetch("/api/customers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(customers),
  }).then((res) => res.json());
}

export async function getCustomer(id: Customer["id"]) {
  return fetch(`/api/customers/${id}`).then((res) => res.json());
}

export async function getCustomers() {
  return fetch("/api/customers").then((res) => res.json());
}

export async function updateCustomers(
  customers: Partial<Customer> & { id: Customer["id"] }[],
) {
  return fetch("/api/customers", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(customers),
  });
}

export async function deleteCustomers(ids: Customer["id"][]) {
  await fetch("/api/customers", {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(ids),
  });
}
