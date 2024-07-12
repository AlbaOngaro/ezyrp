import * as Popover from "@radix-ui/react-popover";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  Root as ModalRoot,
  Trigger as ModalTrigger,
} from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { useState } from "react";
import { NotebookText, Pencil, TrashIcon, User, X } from "lucide-react";

import { Event } from "../types";
import { EventBadge } from "./event-badge";

import { useEvents } from "hooks/useEvents";

import { EditEventModal } from "components/organisms/edit-event-modal/EditEventModal";
import { Dialog } from "components/atoms/dialog";

interface Props {
  event: Event;
  side?: "left" | "top" | "right" | "bottom";
  align?: "center" | "start" | "end";
}

export function EventPopover({ event, side = "left", align = "start" }: Props) {
  const events = useEvents();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <Popover.Portal>
      <Popover.Content
        className="rounded-xl p-5 min-w-[300px] bg-white shadow-[0_24px_38px_3px_rgba(0,0,0,.14),_0_9px_46px_8px_rgba(0,0,0,.12),_0_11px_15px_-7px_rgba(0,0,0,.2)] z-10 focus-within:outline-none"
        sideOffset={8}
        side={side}
        align={align}
      >
        <header className="flex flex-row justify-end gap-2">
          <ModalRoot open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <ModalTrigger>
              <button className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 active:bg-gray-200">
                <Pencil className="h-4 w-4" />
              </button>
            </ModalTrigger>
            <EditEventModal event={event} setIsOpen={setIsEditModalOpen} />
          </ModalRoot>
          <DialogRoot>
            <DialogTrigger asChild>
              <button className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 active:bg-gray-200">
                <TrashIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <Dialog
              title="Do you really want to delete this event?"
              description="This action cannot be undone"
              onConfirm={() =>
                events.delete({
                  id: event._id,
                })
              }
            />
          </DialogRoot>
          <Popover.Close asChild>
            <button className="p-2.5 rounded-full transition-colors duration-300 hover:bg-gray-100 active:bg-gray-200">
              <X className="h-4 w-4" />
            </button>
          </Popover.Close>
        </header>

        <section className="grid grid-cols-[24px_1fr] gap-2 items-center">
          <EventBadge variant={event.variant} />
          <h6 className="font-bold">{event.name}</h6>
          <p className="col-start-2 flex flex-row gap-2 text-sm text-gray-500">
            <time dateTime={event.start}>
              {format(new Date(event.start), "dd MMMM yyyy, HH:mm")}
            </time>
            -
            <time dateTime={event.end}>
              {format(new Date(event.end), "dd MMMM yyyy, HH:mm")}
            </time>
          </p>

          {event?.guests?.length > 0 && (
            <>
              <User className="h-4 w-4 self-start mt-1" />
              <p className="text-sm self-start">
                {event.guests.length}{" "}
                {event.guests.length > 1 ? "Guests:" : "Guest:"}
                <ul className="text-gray-500 mt-2">
                  {event.guests.map((guest) => (
                    <li key={guest._id} className="flex flex-col">
                      <strong>{guest.name}</strong> {guest.email}
                    </li>
                  ))}
                </ul>
              </p>
            </>
          )}

          {event.notes && (
            <>
              <NotebookText className="h-4 w-4 self-start" />
              <p className="text-sm self-start">{event.notes}</p>
            </>
          )}
        </section>
      </Popover.Content>
    </Popover.Portal>
  );
}
