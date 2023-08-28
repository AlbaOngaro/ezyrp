import { ReactElement, useState } from "react";
import { Root, Trigger } from "@radix-ui/react-dialog";

import { Button } from "components/atoms/button/Button";

import { Calendar } from "components/organisms/calendar/Calendar";
import { CreateEventModal } from "components/organisms/create-event-modal/CreateEventModal";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useEvents } from "hooks/useEvents";

export function SchedulePage() {
  const events = useEvents();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  return (
    <Calendar
      className="p-12 lg:h-[calc(100vh_-_64px)] overflow-hidden"
      actions={
        <Root open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
          <Trigger asChild>
            <Button size="lg">Add event</Button>
          </Trigger>

          <CreateEventModal as="modal" setIsOpen={setIsCreatingEvent} />
        </Root>
      }
      events={events.data}
    />
  );
}

SchedulePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
