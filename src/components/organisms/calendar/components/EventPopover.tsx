import {
  Cross1Icon,
  Pencil1Icon,
  PersonIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
import { useEvents } from "../../../../hooks/useEvents";

import { EditEventModal } from "components/organisms/edit-event-modal/EditEventModal";
import { twMerge } from "lib/utils/twMerge";

import { Dialog } from "components/atoms/dialog";
import { Doc } from "convex/_generated/dataModel";

type Event = Doc<"events">;

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
                <Pencil1Icon className="h-5 w-5" />
              </button>
            </ModalTrigger>
            <EditEventModal event={event} setIsOpen={setIsEditModalOpen} />
          </ModalRoot>
          <DialogRoot>
            <DialogTrigger asChild>
              <button className="p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 active:bg-gray-200">
                <TrashIcon className="h-5 w-5" />
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
              <Cross1Icon className="h-4 w-4" />
            </button>
          </Popover.Close>
        </header>

        <section className="grid grid-cols-[24px_1fr] gap-2 items-center">
          <i
            className={twMerge("w-4 h-4 rounded-md", {
              "bg-red-500": event.variant === "red",
              "bg-orange-400": event.variant === "orange",
              "bg-yellow-400": event.variant === "yellow",
              "bg-lime-500": event.variant === "lime",
              "bg-green-500": event.variant === "green",
              "bg-emerald-500": event.variant === "emerald",
              "bg-teal-500": event.variant === "teal",
              "bg-cyan-500": event.variant === "cyan",
              "bg-sky-500": event.variant === "sky",
              "bg-blue-500": event.variant === "blue",
              "bg-indigo-400": event.variant === "indigo",
              "bg-violet-500": event.variant === "violet",
              "bg-purple-500": event.variant === "purple",
              "bg-fuchsia-500": event.variant === "fuchsia",
              "bg-pink-500": event.variant === "pink",
              "bg-rose-500": event.variant === "rose",
            })}
          />
          <h6 className="font-bold">{event.title}</h6>
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
              <PersonIcon className="self-start mt-1" />
              <p className="text-sm self-start">
                {event.guests.length}{" "}
                {event.guests.length > 1 ? "Guests:" : "Guest:"}
                <ul className="text-gray-500">
                  {event.guests.map((guest) => (
                    <li key={guest}>{guest}</li>
                  ))}
                </ul>
              </p>
            </>
          )}
        </section>
      </Popover.Content>
    </Popover.Portal>
  );
}
