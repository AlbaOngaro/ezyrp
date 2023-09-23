import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ITEMS } from "../lib/mutations/CREATE_ITEMS";
import { ITEMS } from "../lib/queries/ITEMS";

export function useItems() {
  const { data, error, loading, refetch } = useQuery(ITEMS);

  const [create] = useMutation(CREATE_ITEMS, {
    refetchQueries: [ITEMS],
  });

  return {
    data,
    error,
    create,
    loading,
    refetch,
  };
}
