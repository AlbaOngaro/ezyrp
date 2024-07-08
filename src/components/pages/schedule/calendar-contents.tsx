import { Container } from "components/atoms/container";

import { EventsCalendar } from "components/organisms/events-calendar";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

export function CalendarContents() {
  const { data: events = [] } = useQuery(api.events.list, {
    status: "approved",
  });

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_124px)] overflow-hidden"
    >
      <EventsCalendar events={events} />
    </Container>
  );
}
