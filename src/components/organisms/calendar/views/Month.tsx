import { eachDayOfInterval, format, isSameDay, isSameWeek } from "date-fns";
import { Root, Trigger } from "@radix-ui/react-popover";

import { EventPopover } from "../components/EventPopover";
import { EventItem } from "../components/EventItem";

import { useCalendarContext } from "../Calendar";
import { getIsLongerThan24Hours } from "../utils";

import { twMerge } from "lib/utils/twMerge";

export function Body() {
  const {
    state: { days },
  } = useCalendarContext();

  const events = days.flatMap((day) => day.events);

  return (
    <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
        <div className="bg-white py-2">
          M<span className="sr-only sm:not-sr-only">on</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">ue</span>
        </div>
        <div className="bg-white py-2">
          W<span className="sr-only sm:not-sr-only">ed</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">hu</span>
        </div>
        <div className="bg-white py-2">
          F<span className="sr-only sm:not-sr-only">ri</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">at</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">un</span>
        </div>
      </div>
      <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div className="hidden w-full relative lg:grid lg:grid-cols-7 lg:gap-px">
          {days.map((day) => (
            <div
              key={day.date.toISOString()}
              className={twMerge("px-3 py-2 bg-gray-50 text-gray-500", {
                "bg-white": day.isCurrentMonth,
              })}
            >
              <time
                dateTime={day.date.toISOString()}
                className={twMerge({
                  "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white":
                    day.isToday,
                })}
              >
                {format(day.date, "dd")}
              </time>
            </div>
          ))}

          <ol
            className="absolute h-full w-full col-span-7 row-span-6 grid grid-cols-7 "
            style={{
              gridTemplateRows: `repeat(${days.length / 7}, minmax(0, 1fr))`,
            }}
          >
            {events.map((event) => {
              const startDate = new Date(event.start);
              const endDate = new Date(event.end);

              return eachDayOfInterval({
                start: startDate,
                end: endDate,
              }).map((day) => {
                const isLongerThan24Hours = getIsLongerThan24Hours(
                  startDate,
                  endDate,
                );

                if (
                  isLongerThan24Hours &&
                  isSameWeek(day, startDate, {
                    weekStartsOn: 1,
                  }) &&
                  !isSameDay(day, startDate)
                ) {
                  return null;
                }

                return (
                  <Root key={event.id}>
                    <Trigger asChild>
                      <EventItem event={event} currentDate={day} />
                    </Trigger>

                    <EventPopover event={event} />
                  </Root>
                );
              });
            })}
          </ol>
        </div>

        <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              className={twMerge(
                "bg-gray-50 flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10",
                {
                  "bg-white": day.isCurrentMonth,
                  "font-semibold": day.isSelected || day.isToday,
                  "text-white": day.isSelected,
                  "text-indigo-600": !day.isSelected && day.isToday,
                  "text-gray-900":
                    !day.isSelected && day.isCurrentMonth && !day.isToday,
                  "text-gray-500":
                    !day.isSelected && !day.isCurrentMonth && !day.isToday,
                },
              )}
            >
              <time
                dateTime={day.date.toISOString()}
                className={twMerge(
                  day.isSelected &&
                    "flex h-6 w-6 items-center justify-center rounded-full",
                  day.isSelected && day.isToday && "bg-indigo-600",
                  day.isSelected && !day.isToday && "bg-gray-900",
                  "ml-auto",
                )}
              >
                {format(day.date, "dd")}
              </time>
              <span className="sr-only">{day.events.length} events</span>
              {day.events.length > 0 && (
                <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                  {day.events.map((event) => (
                    <span
                      key={event.id}
                      className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                    />
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const {
    state: { selected },
  } = useCalendarContext();

  return (
    <h1 className="text-base font-semibold leading-6 text-gray-900">
      <time dateTime={selected.toISOString()}>
        {format(selected, "MMMM yyyy")}
      </time>
    </h1>
  );
}
