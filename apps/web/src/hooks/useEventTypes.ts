import { useMutation, useQuery } from "@apollo/client";
import { CREATE_EVENT_TYPES } from "lib/mutations/CREATE_EVENT_TYPES";
import { DELETE_EVENT_TYPES } from "lib/mutations/DELETE_EVENT_TYPES";
import { EVENT_TYPES } from "lib/queries/EVENT_TYPES";

export function useEventTypes() {
  const { data, loading } = useQuery(EVENT_TYPES);

  const [create] = useMutation(CREATE_EVENT_TYPES, {
    refetchQueries: [EVENT_TYPES],
  });

  const [deleteEventTypes] = useMutation(DELETE_EVENT_TYPES, {
    refetchQueries: [EVENT_TYPES],
  });

  return {
    data,
    loading,
    create,
    delete: deleteEventTypes,
  };
}
