import { useQuery, useMutation } from "@apollo/client";

import { CREATE_CUSTOMERS } from "lib/mutations/CREATE_CUSTOMERS";
import { DELETE_CUSTOMERS } from "lib/mutations/DELETE_CUSTOMERS";
import { UPDATE_CUSTOMERS } from "lib/mutations/UPDATE_CUSTOMERS";

import { CUSTOMERS } from "lib/queries/CUSTOMERS";
import { CUSTOMERS_WITH_LAST_INVOICE } from "lib/queries/CUSTOMERS_WITH_LAST_INVOICE";
import { INVOICES } from "lib/queries/INVOICES";

export function useCustomers() {
  const {
    data,
    error,
    loading: isLoading,
    refetch,
  } = useQuery(CUSTOMERS, {
    fetchPolicy: "cache-and-network",
  });
  const [create] = useMutation(CREATE_CUSTOMERS, {
    refetchQueries: [CUSTOMERS, CUSTOMERS_WITH_LAST_INVOICE],
  });
  const [update] = useMutation(UPDATE_CUSTOMERS, {
    refetchQueries: [CUSTOMERS, CUSTOMERS_WITH_LAST_INVOICE],
  });
  const [deleteCustomer] = useMutation(DELETE_CUSTOMERS, {
    refetchQueries: [CUSTOMERS, CUSTOMERS_WITH_LAST_INVOICE, INVOICES],
  });

  return {
    data,
    refetch,
    error,
    isLoading,
    create,
    update,
    delete: deleteCustomer,
  };
}
