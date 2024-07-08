import { Container } from "components/atoms/container";
import { useEvents } from "hooks/useEvents";

import { EventsCalendar } from "components/organisms/events-calendar";

export function CalendarContents() {
  const events = useEvents();

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_124px)] overflow-hidden"
    >
      <EventsCalendar events={events?.data} />
    </Container>
  );
}
