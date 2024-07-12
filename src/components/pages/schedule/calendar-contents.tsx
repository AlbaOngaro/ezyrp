import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { formatISO } from "date-fns";
import { Container } from "components/atoms/container";

import { EventsCalendar } from "components/organisms/events-calendar";
import { api } from "convex/_generated/api";

const PAGE_SIZE = 100;

type Range = {
  start: string;
  end: string;
};

export function CalendarContents() {
  const [range, setRange] = useState<Range | undefined>(undefined);

  const { results: events = [] } = usePaginatedQuery(
    api.events.search,
    {
      range,
    },
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_124px)] overflow-hidden"
    >
      <EventsCalendar
        events={events}
        onViewChange={(start, end) =>
          setRange({
            start: formatISO(start, {
              representation: "date",
            }),
            end: formatISO(end, {
              representation: "date",
            }),
          })
        }
      />
    </Container>
  );
}
