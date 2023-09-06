import { useMutation, useQuery } from "@apollo/client";

import { INVOICES } from "lib/queries/INVOICES";
import { CREATE_INVOICES } from "lib/mutations/CREATE_INVOICES";
import { UPDATE_INVOICES } from "lib/mutations/UPDATE_INVOICES";
import { DELETE_INVOICES } from "lib/mutations/DELETE_INVOICES";
import { STATS } from "lib/queries/STATS";

export function useInvoices() {
  const { data, error, loading: isLoading, refetch } = useQuery(INVOICES);
  const [create] = useMutation(CREATE_INVOICES, {
    refetchQueries: [INVOICES, STATS],
  });
  const [update] = useMutation(UPDATE_INVOICES, {
    refetchQueries: [INVOICES, STATS],
  });
  const [deleteInvoices] = useMutation(DELETE_INVOICES, {
    refetchQueries: [INVOICES, STATS],
  });

  return {
    data,
    error,
    isLoading,
    create,
    refetch,
    update,
    delete: deleteInvoices,
  };
}
