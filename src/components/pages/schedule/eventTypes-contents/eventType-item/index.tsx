import { CopyIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  Trigger as ContextTrigger,
  Root as ContextRoot,
  Portal as ContextPortal,
} from "@radix-ui/react-context-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { eventTypeItemVariants } from "./styles";

import { cn } from "lib/utils/cn";
import { Checkbox } from "components/atoms/checkbox";
import { ContextMenu } from "components/organisms/context-menu/ContextMenu";
import { Doc } from "convex/_generated/dataModel";

type EventType = Doc<"eventTypes">;

type Props = {
  event: EventType;
  setSelected: Dispatch<SetStateAction<string[]>>;
  selected: string[];
};

export function EventTypeItem({ event, setSelected, selected }: Props) {
  const router = useRouter();
  const [isCopySuccesful, setIsCopySuccesful] = useState(false);

  useEffect(() => {
    if (isCopySuccesful) {
      const timeout = setTimeout(() => {
        setIsCopySuccesful(false);
      }, 700);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isCopySuccesful]);

  return (
    <article
      className={cn(eventTypeItemVariants({ variant: event.variant }))}
      key={event._id}
    >
      <header className="relative py-2 flex items-end justify-between">
        <Checkbox
          checked={selected.includes(event._id)}
          onChange={() =>
            setSelected((curr) => {
              if (curr.includes(event._id)) {
                return curr.filter((id) => id !== event._id);
              }

              return [...curr, event._id];
            })
          }
          className="relative inset-0"
        />

        <ContextRoot>
          <ContextTrigger asChild>
            <button
              onClick={(e) => {
                e?.target?.dispatchEvent(
                  new MouseEvent("contextmenu", {
                    bubbles: true,
                    clientX: (
                      e?.target as HTMLButtonElement
                    )?.getBoundingClientRect().x,
                    clientY: (
                      e?.target as HTMLButtonElement
                    )?.getBoundingClientRect().y,
                  }),
                );
              }}
            >
              <DotsVerticalIcon />
            </button>
          </ContextTrigger>

          <ContextPortal>
            <ContextMenu
              items={[
                {
                  type: "item",
                  label: "Edit",
                  onClick: () => router.push(`/event-types/${event._id}/edit`),
                },
              ]}
            />
          </ContextPortal>
        </ContextRoot>
      </header>
      <h6 className="font-bold text-lg">{event.name}</h6>
      <p className="text-gray-500">{event.description}</p>
      <span className="text-gray-500">{event.duration} mins</span>
      <footer className="border-t border-gray-100 w-[calc(100%_+_1rem)] p-2 mt-2 -ml-2 -mb-2">
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={0} open={isCopySuccesful}>
            <Tooltip.Trigger asChild>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/booking/${event._id}`,
                    );
                    setIsCopySuccesful(true);
                  } catch (error: unknown) {
                    console.error(error);
                  }
                }}
                className="flex flex-row items-center w-full gap-2 underline-offset-2 text-secondary-foreground text-sm hover:underline"
              >
                <CopyIcon /> Copy link
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                side="top"
                align="start"
                sideOffset={16}
                onPointerDownOutside={() => setIsCopySuccesful(false)}
              >
                Copied to clipboard
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </footer>
    </article>
  );
}
