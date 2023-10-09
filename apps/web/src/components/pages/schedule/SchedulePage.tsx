import { ReactElement, useState } from "react";
import { Root, Trigger } from "@radix-ui/react-dialog";

import { useEvents } from "hooks/useEvents";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";

import { Calendar } from "components/organisms/calendar/Calendar";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { CreateEventModal } from "components/organisms/create-event-modal/CreateEventModal";

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
