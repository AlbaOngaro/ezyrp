import { ReactElement, useState } from "react";
import { Root, Trigger } from "@radix-ui/react-dialog";

import { useEvents } from "../../../hooks/useEvents";

import { Button } from "../../atoms/button/Button";
import { Container } from "../../atoms/container/Container";

import { Calendar } from "../../organisms/calendar/Calendar";
import { CreateEventModal } from "../../organisms/create-event-modal/CreateEventModal";

import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";

export function SchedulePage() {
  const events = useEvents();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_64px)] overflow-hidden"
    >
      <Calendar
        actions={
          <Root open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
            <Trigger asChild>
              <Button size="lg">Add event</Button>
            </Trigger>

            <CreateEventModal as="modal" setIsOpen={setIsCreatingEvent} />
          </Root>
        }
        events={events?.data?.events}
      />
    </Container>
  );
}

SchedulePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
