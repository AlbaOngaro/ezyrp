import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { format, isValid } from "date-fns";
import { Event } from "lib/types";

import { Modal } from "components/atoms/modal/Modal";
import { useEvents } from "hooks/useEvents";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  event: Omit<Event, "workspace">;
}

export function EditEventModal({ setIsOpen, event: initialEvent }: Props) {
  const events = useEvents();

  const [event, setEvent] = useState<Omit<Event, "workspace">>(initialEvent);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await events.update([event]);
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
          value={event.title}
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
            value={format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => {
              if (isValid(new Date(e.target.value))) {
                setEvent((curr) => ({
                  ...curr,
                  start: new Date(e.target.value).toISOString(),
                }));
              }
            }}
          />

          <Input
            className="min-w-0 w-full"
            label="End"
            type="datetime-local"
            name="end"
            step={60 * 5} // 5 minutes
            min={format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")}
            value={format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => {
              if (isValid(new Date(e.target.value))) {
                setEvent((curr) => ({
                  ...curr,
                  end: new Date(e.target.value).toISOString(),
                }));
              }
            }}
            validations={{
              tooLong: "too long",
            }}
          />
        </div>

        <Button className="w-fit ml-auto" size="lg" type="submit">
          Save
        </Button>
      </Form>
    </Modal>
  );
}
