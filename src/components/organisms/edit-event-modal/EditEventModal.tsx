import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { format } from "date-fns";

import { Modal } from "components/atoms/modal";
import { useEvents } from "hooks/useEvents";
import { Input } from "components/atoms/input";
import { Button } from "components/atoms/button";
import { Doc } from "convex/_generated/dataModel";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  event: Event;
}

type Event = Doc<"events">;

export function EditEventModal({ setIsOpen, event: initialEvent }: Props) {
  const events = useEvents();
  const [event, setEvent] = useState(initialEvent);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await events.update({
        id: event._id,
        ...event,
        guests: [],
      });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          required
          value={event.title || ""}
          onChange={(e) =>
            setEvent((curr) => ({
              ...curr,
              title: e.target.value,
            }))
          }
          validations={{
            valueMissing: "This field is required",
          }}
        />

        <div className="flex flex-row gap-4">
          <Input
            className="min-w-0 w-full"
            label="Start"
            type="datetime-local"
            name="start"
            step={60 * 5} // 5 minutes
            value={format(
              event.start ? new Date(event.start) : new Date(),
              "yyyy-MM-dd'T'HH:mm",
            )}
            onChange={(start) => {
              setEvent((curr) => ({
                ...curr,
                start: start.toISOString(),
              }));
            }}
          />

          <Input
            className="min-w-0 w-full"
            label="End"
            type="datetime-local"
            name="end"
            step={60 * 5} // 5 minutes
            min={format(
              event.start ? new Date(event.start) : new Date(),
              "yyyy-MM-dd'T'HH:mm",
            )}
            value={format(
              event.end ? new Date(event.end) : new Date(),
              "yyyy-MM-dd'T'HH:mm",
            )}
            onChange={(end) => {
              setEvent((curr) => ({
                ...curr,
                end: end.toISOString(),
              }));
            }}
            validations={{
              tooLong: "too long",
            }}
          />
        </div>

        <Button className="w-fit ml-auto" type="submit">
          Save
        </Button>
      </Form>
    </Modal>
  );
}
