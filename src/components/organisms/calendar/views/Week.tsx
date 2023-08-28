import { add, format, isSameDay, isSameWeek, minutesToHours } from "date-fns";
import { Fragment, MouseEvent } from "react";
import { Anchor, Root, Trigger } from "@radix-ui/react-popover";

import { getIsLongerThan24Hours, isSavedEvent } from "../utils";
import { useCalendarContext } from "../Calendar";
import { EventItem } from "../components/EventItem";
import { EventPopover } from "../components/EventPopover";

import { Event } from "lib/types";

import { twMerge } from "lib/utils/twMerge";
import { convertRemToPx } from "lib/utils/convertRemToPx";

import { CreateEventModal } from "components/organisms/create-event-modal/CreateEventModal";

function EventItemWrapper({
  event,
  currentDate,
}: {
  event: Omit<Event, "workspace">;
  currentDate: Date;
}) {
  const {
    state: { days },
    dispatch,
  } = useCalendarContext();

  const events = days.flatMap((day) => day.events);

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const isLongerThan24Hours = getIsLongerThan24Hours(startDate, endDate);

  if (
    isLongerThan24Hours &&
    isSameWeek(currentDate, startDate, {
      weekStartsOn: 1,
    }) &&
    !isSameDay(currentDate, startDate)
  ) {
    return null;
  }

  if (isSavedEvent(event)) {
    return (
      <Root>
        <Trigger
          onClick={(e) => {
            e.stopPropagation();
          }}
          asChild
        >
          <EventItem event={event} currentDate={currentDate} />
        </Trigger>

        <EventPopover event={event} />
      </Root>
    );
  }

  return (
    <Root open>
      <Anchor asChild>
        <EventItem event={event} currentDate={currentDate} />
      </Anchor>

      <CreateEventModal
        event={event}
        onChange={(updated) =>
          dispatch({
            type: "SET_EVENTS",
            payload: {
              events: events.map((e) => {
                if (e.id !== event.id) {
                  return e;
                }
                return updated as Event;
              }),
            },
          })
        }
        className="z-50"
        setIsOpen={console.debug}
        as="popover"
        side="left"
        align="start"
        sideOffset={8}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </Root>
  );
}

export function Body() {
  const {
    state: { days },
    dispatch,
  } = useCalendarContext();

  const events = days.flatMap((day) => day.events);
  const isCreatingNewEvent = events.some((event) => !isSavedEvent(event));

  const handleGridClick = (e: MouseEvent<HTMLOListElement>) => {
    if ((e.target as HTMLElement).id !== "grid") {
      return;
    }

    if (isCreatingNewEvent) {
      dispatch({
        type: "SET_EVENTS",
        payload: {
          events: events.filter((event) => isSavedEvent(event)),
        },
      });
      return;
    }

    const rect = (e.target as HTMLOListElement).getBoundingClientRect();
    const firstRow = convertRemToPx(1.75);
    const y = e.clientY - (rect.top + firstRow);

    if (y < 0) {
      return;
    }

    const row = (rect.height - firstRow) / 288;
    const minutes = Math.floor(y / row) * 5;

    const x = e.clientX - rect.left;
    const col = rect.width / 7;
    const weekDay = Math.floor(x / col);

    const day = days[weekDay].date;

    const start = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      minutesToHours(minutes),
      minutes - minutesToHours(minutes) * 60,
    );

    dispatch({
      type: "SET_EVENTS",
      payload: {
        events: [
          ...events,
          {
            id: crypto.randomUUID(),
            title: "",
            start: start.toISOString(),
            end: add(start, {
              hours: 1,
            }).toISOString(),
            variant: "blue",
          },
        ],
      },
    });
  };

  return (
    <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
      <div
        style={{ width: "165%" }}
        className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
      >
        <div className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
          <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
            {days.map((day) => (
              <button
                className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                key={day.date.toISOString()}
              >
                <span className="flex items-baseline">
                  {format(day.date, "EEE")}

                  <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    {format(day.date, "d")}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
            <div className="col-end-1 w-14" />

            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex items-center justify-center py-3"
              >
                <span className="flex items-baseline gap-2">
                  {format(day.date, "EEE")}

                  <span
                    className={twMerge(
                      "items-center justify-center font-semibold text-gray-900",
                      {
                        "flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white":
                          day.isToday,
                      },
                    )}
                  >
                    {format(day.date, "d")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style={{
                gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))",
              }}
            >
              <div className="row-end-1 h-7"></div>
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  12AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  1AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  2AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  3AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  4AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  5AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  6AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  7AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  8AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  9AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  10AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  11AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  12PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  1PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  2PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  3PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  4PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  5PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  6PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  7PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  8PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  9PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  10PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  11PM
                </div>
              </div>
              <div />
            </div>

            {/* Vertical lines */}
            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
              <div className="col-start-1 row-span-full" />
              <div className="col-start-2 row-span-full" />
              <div className="col-start-3 row-span-full" />
              <div className="col-start-4 row-span-full" />
              <div className="col-start-5 row-span-full" />
              <div className="col-start-6 row-span-full" />
              <div className="col-start-7 row-span-full" />
              <div className="col-start-8 row-span-full w-8" />
            </div>

            {/* Events */}
            <ol
              className="relative z-20 col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
              style={{
                gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
              }}
              onClick={handleGridClick}
              id="grid"
            >
              {days.map((day) => (
                <Fragment key={day.date.toISOString()}>
                  {day.events.map((event) => (
                    <EventItemWrapper
                      key={event.id}
                      event={event}
                      currentDate={day.date}
                    />
                  ))}
                </Fragment>
              ))}
            </ol>
          </div>
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
