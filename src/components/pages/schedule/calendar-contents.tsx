import { useState } from "react";
import { formatISO } from "date-fns";
import { Container } from "components/atoms/container";

import { usePaginatedQuery } from "lib/hooks/usePaginatedQuery";

import { EventsCalendar } from "components/organisms/events-calendar";
import { api } from "convex/_generated/api";

const PAGE_SIZE = 100;

type Range = {
  start: string;
  end: string;
};

type Props = {
  selected?: Date;
};

export function CalendarContents({ selected }: Props) {
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
        selected={selected}
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
