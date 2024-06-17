import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ITEMS } from "../lib/mutations/CREATE_ITEMS";
import { ITEMS } from "../lib/queries/ITEMS";
import { UPDATE_ITEMS } from "lib/mutations/UPDATE_ITEMS";
import { DELETE_ITEMS } from "lib/mutations/DELETE_ITEMS";

export function useItems() {
  const { data, error, loading, refetch } = useQuery(ITEMS);

  const [create] = useMutation(CREATE_ITEMS, {
    refetchQueries: [ITEMS],
  });

  const [update] = useMutation(UPDATE_ITEMS, {
    refetchQueries: [ITEMS],
  });

  const [deleteItems] = useMutation(DELETE_ITEMS, {
    refetchQueries: [ITEMS],
  });

  return {
    data,
    error,
    create,
    loading,
    refetch,
    update,
    delete: deleteItems,
  };
}
