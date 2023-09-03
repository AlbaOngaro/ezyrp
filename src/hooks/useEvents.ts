import { useMutation, useQuery } from "@apollo/client";
import { EVENTS } from "lib/queries/EVENTS";
import { CREATE_EVENTS } from "lib/mutations/CREATE_EVENTS";
import { UPDATE_EVENTS } from "lib/mutations/UPDATE_EVENTS";
import { DELETE_EVENTS } from "lib/mutations/DELETE_EVENTS";

export function useEvents() {
  const { data, error, loading: isLoading, refetch } = useQuery(EVENTS);
  const [create] = useMutation(CREATE_EVENTS);
  const [update] = useMutation(UPDATE_EVENTS);
  const [deleteEvents] = useMutation(DELETE_EVENTS);

  return {
    data,
    error,
    isLoading,
    refetch,
    create,
    update,
    delete: deleteEvents,
  };
}
