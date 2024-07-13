import { forwardRef, useEffect, useMemo, useRef } from "react";
import { format, getWeekOfMonth, isSameDay } from "date-fns";
import {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/router";
import { EventPopover } from "../event-popover";
import { getGridColumn, getGridRow, getIsLongerThan24Hours } from "../../utils";
import { useCalendarContext } from "../../hooks/useCalendarContext";
import { Event } from "../../types";
import { eventItemVariants } from "./styles";

import { cn } from "lib/utils/cn";
import { mergeRefs } from "lib/utils/mergeRefs";

interface Props {
  event: Event;
  currentDate: Date;
  className?: string;
}

export const EventItem = forwardRef<HTMLLIElement, Props>(function EventItem(
  { event, currentDate, className, ...rest },
  ref,
) {
  const {
    state: { view },
  } = useCalendarContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const eid = searchParams.get("eid");

  const item = useRef<HTMLLIElement | null>(null);

  const startDate = useMemo(() => new Date(event.start), [event.start]);
  const endDate = useMemo(() => new Date(event.end), [event.end]);

  const gridRow = useMemo(() => {
    if (view === "month") {
      return getWeekOfMonth(currentDate, {
        weekStartsOn: 1,
      });
    }
    return getGridRow(startDate, endDate, currentDate);
  }, [currentDate, endDate, startDate, view]);

  const gridColumn = getGridColumn(startDate, endDate, currentDate);

  const isLongerThan24Hours = getIsLongerThan24Hours(startDate, endDate);

  const status = event.status;
  const variant = event.variant;

  useEffect(() => {
    if (eid === event._id && item.current) {
      item.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [eid, event]);

  return (
    <PopoverRoot
      defaultOpen={eid === event._id}
      onOpenChange={() => {
        if (eid === event._id) {
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete("eid");

          if (newSearchParams.size > 0) {
            router.replace(`${router.pathname}?${newSearchParams.toString()}`);
          } else {
            router.replace(router.pathname);
          }
        }
      }}
    >
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        <li
          ref={mergeRefs(ref, item)}
          className={cn(
            eventItemVariants({
              view,
              status,
              variant,
            }),
            {
              "rounded-b-none":
                !isSameDay(startDate, endDate) &&
                !isSameDay(endDate, currentDate),
              "rounded-t-none":
                !isSameDay(startDate, endDate) &&
                isSameDay(endDate, currentDate),
              "rounded-none":
                (!isSameDay(startDate, currentDate) &&
                  !isSameDay(endDate, currentDate)) ||
                isLongerThan24Hours,
              "py-0 justify-center": isLongerThan24Hours,
              "shadow-2xl": eid === event._id,
            },
            className,
          )}
          style={{
            gridRow,
            gridColumn,
          }}
          {...rest}
        >
          <p
            className={cn("font-semibold", {
              truncate: view === "month",
            })}
          >
            {event.name}
          </p>
          {(!isLongerThan24Hours || view === "month") && (
            <p className="shrink-0">
              {view === "month" ? (
                <time>{format(new Date(event.start), "hh aa")}</time>
              ) : (
                <time dateTime={event.start}>
                  {format(new Date(event.start), "HH:mm aa")} -{" "}
                  {format(new Date(event.end), "HH:mm aa")}
                </time>
              )}
            </p>
          )}
        </li>
      </PopoverTrigger>
      <EventPopover side="left" align="center" event={event} />
    </PopoverRoot>
  );
});
