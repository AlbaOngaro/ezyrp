import { useRouter } from "next/router";
import { useState } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { useEventTypes } from "hooks/useEventTypes";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Dialog } from "components/atoms/dialog/Dialog";
import { EventTypeItem } from "components/pages/schedule/EventTypeItem";
import { Id } from "convex/_generated/dataModel";

export function EventTypesContents() {
  const router = useRouter();
  const eventTypes = useEventTypes();

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Event types"
          description="Define the event types you want to share with your customers"
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button size="lg" onClick={() => router.push("/event-types/create")}>
            Add event type
          </Button>
        </div>
      </Container>
      <Container as="header" className="py-0">
        {selected.length > 0 && (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button variant="danger" size="sm">
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected event types?"
              description="This action cannot be undone"
              onConfirm={() =>
                Promise.all(
                  selected.map((id) =>
                    eventTypes.delete({ id: id as Id<"eventTypes"> }),
                  ),
                ).then(() => setSelected([]))
              }
            />
          </DialogRoot>
        )}
      </Container>
      <Container className="grid grid-cols-4 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
        {eventTypes.data?.map((event) => (
          <EventTypeItem
            event={event}
            selected={selected}
            setSelected={setSelected}
            key={event._id}
          />
        ))}
      </Container>
    </>
  );
}
