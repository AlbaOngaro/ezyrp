import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
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
import { useEvents } from "hooks/useEvents";

import { Event } from "lib/types";
import { Dialog } from "components/atoms/dialog/Dialog";
import { EditEventModal } from "components/organisms/edit-event-modal/EditEventModal";

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
              onConfirm={() => events.delete([event.id])}
            />
          </DialogRoot>
        </header>

        <section>
          <h6 className="mb-2 font-bold">{event.title}</h6>
          <p className="flex flex-row gap-2 text-sm text-gray-500">
            <time dateTime={event.start}>
              {format(new Date(event.start), "dd MMMM yyyy, HH:mm")}
            </time>
            -
            <time dateTime={event.end}>
              {format(new Date(event.end), "dd MMMM yyyy, HH:mm")}
            </time>
          </p>
        </section>
      </Popover.Content>
    </Popover.Portal>
  );
}
