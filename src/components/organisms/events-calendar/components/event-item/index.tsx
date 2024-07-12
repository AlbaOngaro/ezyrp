import { forwardRef } from "react";
import { format, getWeekOfMonth, isSameDay } from "date-fns";
import {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";

import { EventPopover } from "../EventPopover";
import { getGridColumn, getGridRow, getIsLongerThan24Hours } from "../../utils";
import { useCalendarContext } from "../../hooks/useCalendarContext";
import { Event } from "../../types";
import { eventItemVariants } from "./styles";

import { cn } from "lib/utils/cn";

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

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const gridRow =
    view === "month"
      ? getWeekOfMonth(currentDate, {
          weekStartsOn: 1,
        })
      : getGridRow(startDate, endDate, currentDate);
  const gridColumn = getGridColumn(startDate, endDate, currentDate);

  const isLongerThan24Hours = getIsLongerThan24Hours(startDate, endDate);

  const status = event.status;
  const variant = event.variant;

  return (
    <PopoverRoot>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
        asChild
      >
        <li
          ref={ref}
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
