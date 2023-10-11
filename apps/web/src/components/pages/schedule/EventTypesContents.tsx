import { useRouter } from "next/router";
import { CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";

import { twMerge } from "lib/utils/twMerge";

import { useEventTypes } from "hooks/useEventTypes";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Checkbox } from "components/atoms/checkbox/Checkbox";
import { Dialog } from "components/atoms/dialog/Dialog";

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
                eventTypes.delete({
                  variables: {
                    ids: selected,
                  },
                  onCompleted: () => setSelected([]),
                })
              }
            />
          </DialogRoot>
        )}
      </Container>
      <Container className="grid grid-cols-4 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
        {eventTypes.data?.eventTypes?.map((event) => (
          <article
            className={twMerge("bg-white p-2 shadow-md rounded-md border-t-4", {
              "border-red-400": event.variant === "red",
              "border-orange-400": event.variant === "orange",
              "border-yellow-400": event.variant === "yellow",
              "border-lime-400": event.variant === "lime",
              "border-green-400": event.variant === "green",
              "border-emerald-400": event.variant === "emerald",
              "border-teal-400": event.variant === "teal",
              "border-cyan-400": event.variant === "cyan",
              "border-sky-400": event.variant === "sky",
              "border-blue-400": event.variant === "blue",
              "border-indigo-400": event.variant === "indigo",
              "border-violet-400": event.variant === "violet",
              "border-purple-400": event.variant === "purple",
              "border-fuchsia-400": event.variant === "fuchsia",
              "border-pink-400": event.variant === "pink",
              "border-rose-400": event.variant === "rose",
            })}
            key={event.id}
          >
            <header className="relative">
              <Checkbox
                checked={selected.includes(event.id)}
                onChange={() =>
                  setSelected((curr) => {
                    if (curr.includes(event.id)) {
                      return curr.filter((id) => id !== event.id);
                    }

                    return [...curr, event.id];
                  })
                }
                className="relative inset-0"
              />
            </header>
            <h6 className="font-bold text-lg">{event.name}</h6>
            <p className="text-gray-500">{event.description}</p>
            <span className="text-gray-500">{event.duration} mins</span>
            <footer className="border-t border-gray-100 w-[calc(100%_+_1rem)] p-2 mt-2 -ml-2 -mb-2">
              <button className="flex flex-row items-center w-full gap-2 underline-offset-2 text-sm text-orange-400 hover:underline">
                <CopyIcon /> Copy link
              </button>
            </footer>
          </article>
        ))}
      </Container>
    </>
  );
}
