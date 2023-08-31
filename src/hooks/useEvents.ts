import useSWR from "swr";

import { CreateEventInput, Event } from "lib/types";

async function getEvents() {
  return fetch("/api/events").then((res) => res.json());
}

export function useEvents() {
  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Event[], unknown, "/api/events">("/api/events", getEvents);

  return {
    data,
    error,
    mutate,
    isLoading,
    refetch: async () => {
      try {
        const result = await mutate<Event[]>(getEvents);

        if (!result) {
          throw Error("no results");
        }

        return result;
      } catch (error: unknown) {
        console.error(error);
        return [];
      }
    },
    create: (event: CreateEventInput) =>
      mutate(async () => {
        await fetch("/api/events", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(event),
        });

        return getEvents();
      }),
    update: (event: Partial<Event> & { id: Event["id"] }[]) =>
      mutate(async () => {
        await fetch("/api/events", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(event),
        });

        return getEvents();
      }),
    delete: (ids: Event["id"][]) =>
      mutate(async () => {
        await fetch("/api/events", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(ids),
        });

        return getEvents();
      }),
  };
}
