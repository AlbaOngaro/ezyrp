import { useQuery, useMutation } from "@apollo/client";
import { CREATE_CUSTOMERS } from "lib/mutations/CREATE_CUSTOMERS";
import { DELETE_CUSTOMERS } from "lib/mutations/DELETE_CUSTOMERS";
import { UPDATE_CUSTOMERS } from "lib/mutations/UPDATE_CUSTOMERS";
import { CUSTOMERS } from "lib/queries/CUSTOMERS";

export function useCustomers() {
  const {
    data,
    error,
    loading: isLoading,
  } = useQuery(CUSTOMERS, {
    fetchPolicy: "cache-and-network",
  });
  const [create] = useMutation(CREATE_CUSTOMERS);
  const [update] = useMutation(UPDATE_CUSTOMERS);
  const [deleteCustomer] = useMutation(DELETE_CUSTOMERS);

  return {
    data,
    error,
    isLoading,
    create,
    update,
    delete: deleteCustomer,
  };
}
