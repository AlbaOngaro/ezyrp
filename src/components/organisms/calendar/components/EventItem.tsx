import { forwardRef, useState } from "react";
import { format, getWeekOfMonth, isSameDay } from "date-fns";
import {
  getGridColumn,
  getGridRow,
  getIsLongerThan24Hours,
} from "components/organisms/calendar/utils";
import { twMerge } from "lib/utils/twMerge";
import { useCalendarContext } from "components/organisms/calendar/Calendar";
import { Event } from "__generated__/graphql";

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

  const [hovering, setHovering] = useState("");

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

  return (
    <li
      ref={ref}
      className={twMerge(
        className,
        "flex cursor-pointer leading-5 text-xs p-2",
        {
          "group mt-10 h-fit justify-between gap-2 py-1 rounded-sm":
            view === "month",
          "mt-px flex-col overflow-y-auto rounded-lg text-xs": view !== "month",
          "rounded-b-none":
            !isSameDay(startDate, endDate) && !isSameDay(endDate, currentDate),
          "rounded-t-none":
            !isSameDay(startDate, endDate) && isSameDay(endDate, currentDate),
          "rounded-none":
            (!isSameDay(startDate, currentDate) &&
              !isSameDay(endDate, currentDate)) ||
            isLongerThan24Hours,
          "py-0 justify-center": isLongerThan24Hours,

          "shadow-sm": hovering === event.id,
          "bg-red-50 hover:bg-red-100": event.variant === "red",
          "bg-orange-50 hover:bg-orange-100": event.variant === "orange",
          "bg-yellow-50 hover:bg-yellow-100": event.variant === "yellow",
          "bg-lime-50 hover:bg-lime-100": event.variant === "lime",
          "bg-green-5 hover:bg-green-1000": event.variant === "green",
          "bg-emerald-50 hover:bg-emerald-100": event.variant === "emerald",
          "bg-teal-50 hover:bg-teal-100": event.variant === "teal",
          "bg-cyan-50 hover:bg-cyan-100": event.variant === "cyan",
          "bg-sky-50 hover:bg-sky-100": event.variant === "sky",
          "bg-blue-50 hover:bg-blue-100": event.variant === "blue",
          "bg-indigo-50 hover:bg-indigo-100": event.variant === "indigo",
          "bg-violet-50 hover:bg-violet-100": event.variant === "violet",
          "bg-purple-50 hover:bg-purple-100": event.variant === "purple",
          "bg-fuchsia-50 hover:bg-fuchsia-100": event.variant === "fuchsia",
          "bg-pink-50 hover:bg-pink-100": event.variant === "pink",
          "bg-rose-50 hover:bg-rose-100": event.variant === "rose",
        },
      )}
      onMouseEnter={() => setHovering(event.id)}
      onMouseLeave={() => setHovering("")}
      style={{
        gridRow,
        gridColumn,
      }}
      {...rest}
    >
      <p
        className={twMerge("font-semibold", {
          truncate: view === "month",
          "text-red-500": event.variant === "red",
          "text-orange-500": event.variant === "orange",
          "text-yellow-500": event.variant === "yellow",
          "text-lime-500": event.variant === "lime",
          "text-green-500": event.variant === "green",
          "text-emerald-500": event.variant === "emerald",
          "text-teal-500": event.variant === "teal",
          "text-cyan-500": event.variant === "cyan",
          "text-sky-500": event.variant === "sky",
          "text-blue-500": event.variant === "blue",
          "text-indigo-500": event.variant === "indigo",
          "text-violet-500": event.variant === "violet",
          "text-purple-500": event.variant === "purple",
          "text-fuchsia-500": event.variant === "fuchsia",
          "text-pink-500": event.variant === "pink",
          "text-rose-500": event.variant === "rose",
        })}
      >
        {event.title}
      </p>
      {(!isLongerThan24Hours || view === "month") && (
        <p
          className={twMerge("shrink-0", {
            "text-red-500 group-hover:text-red-700": event.variant === "red",
            "text-orange-500 group-hover:text-orange-700":
              event.variant === "orange",
            "text-yellow-500 group-hover:text-yellow-700":
              event.variant === "yellow",
            "text-lime-500 group-hover:text-lime-700": event.variant === "lime",
            "text-green-500 group-hover:text-green-700":
              event.variant === "green",
            "text-emerald-500 group-hover:text-emerald-700":
              event.variant === "emerald",
            "text-teal-500 group-hover:text-teal-700": event.variant === "teal",
            "text-cyan-500 group-hover:text-cyan-700": event.variant === "cyan",
            "text-sky-500 group-hover:text-sky-700": event.variant === "sky",
            "text-blue-500 group-hover:text-blue-700": event.variant === "blue",
            "text-indigo-500 group-hover:text-indigo-700":
              event.variant === "indigo",
            "text-violet-500 group-hover:text-violet-700":
              event.variant === "violet",
            "text-purple-500 group-hover:text-purple-700":
              event.variant === "purple",
            "text-fuchsia-500 group-hover:text-fuchsia-700":
              event.variant === "fuchsia",
            "text-pink-500 group-hover:text-pink-700": event.variant === "pink",
            "text-rose-500 group-hover:text-rose-700": event.variant === "rose",
          })}
        >
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
  );
});
