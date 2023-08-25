import useSWR from "swr";

import { Event } from "lib/types";

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
    refech: async () => {
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
    create: (event: Omit<Event, "id" | "workspace">) =>
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
  };
}
