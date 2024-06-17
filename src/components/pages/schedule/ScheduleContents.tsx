import { Container } from "components/atoms/container";
import { useEvents } from "hooks/useEvents";

import { Calendar } from "components/organisms/calendar/Calendar";

export function ScheduleContents() {
  const events = useEvents();

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_124px)] overflow-hidden"
    >
      <Calendar events={events?.data} />
    </Container>
  );
}
