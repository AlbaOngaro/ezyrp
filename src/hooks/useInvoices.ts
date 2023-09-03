import { useMutation, useQuery } from "@apollo/client";

import { INVOICES } from "lib/queries/INVOICES";
import { CREATE_INVOICES } from "lib/mutations/CREATE_INVOICES";
import { UPDATE_INVOICES } from "lib/mutations/UPDATE_INVOICES";
import { DELETE_INVOICES } from "lib/mutations/DELETE_INVOICES";

export function useInvoices() {
  const { data, error, loading: isLoading, refetch } = useQuery(INVOICES);
  const [create] = useMutation(CREATE_INVOICES, {
    refetchQueries: [INVOICES],
  });
  const [update] = useMutation(UPDATE_INVOICES, {
    refetchQueries: [INVOICES],
  });
  const [deleteInvoices] = useMutation(DELETE_INVOICES, {
    refetchQueries: [INVOICES],
  });

  return {
    data,
    error,
    isLoading,
    create,
    read: refetch,
    update,
    delete: deleteInvoices,
  };
}
