import { add, format, isSameDay, minutesToHours } from "date-fns";
import { Root, Trigger, Anchor } from "@radix-ui/react-popover";
import { MouseEvent } from "react";

import { EventItem } from "../components/EventItem";
import { EventPopover } from "../components/EventPopover";
import { useCalendarContext } from "../Calendar";
import { isSavedEvent } from "../utils";

import { convertRemToPx } from "lib/utils/convertRemToPx";

import { MonthWidget } from "components/atoms/month-widget/MonthWidget";
import { Event } from "lib/types";
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

        <EventPopover side="top" align="center" event={event} />
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
    state: { selected, days },
    dispatch,
  } = useCalendarContext();

  const events = days.flatMap((day) => day.events);
  const isCreatingNewEvent = events.some((event) => !isSavedEvent(event));

  const handleGridClick = (e: MouseEvent<HTMLOListElement>) => {
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

    const day = selected;

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
    <div className="isolate flex flex-auto overflow-hidden bg-white">
      <div className="flex flex-auto flex-col overflow-auto">
        <div className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden">
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>W</span>
            {/* Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-indigo-600", Today (Selected): "bg-indigo-600 text-white" */}
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              19
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>T</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-indigo-600">
              20
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>F</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              21
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>S</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-base font-semibold text-white">
              22
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>S</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              23
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>M</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              24
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>T</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              25
            </span>
          </button>
        </div>
        <div className="flex w-full flex-auto">
          <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
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
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  12AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  1AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  2AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  3AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  4AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  5AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  6AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  7AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  8AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  9AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  10AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  11AM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  12PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  1PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  2PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  3PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  4PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  5PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  6PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  7PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  8PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  9PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  10PM
                </div>
              </div>
              <div />
              <div>
                <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  11PM
                </div>
              </div>
              <div />
            </div>

            {/* Events */}
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
              style={{
                gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
              }}
              onClick={handleGridClick}
            >
              {days
                .find((day) => isSameDay(day.date, selected))
                ?.events.map((event) => (
                  <EventItemWrapper
                    key={event.id}
                    event={event}
                    currentDate={selected}
                  />
                ))}
            </ol>
          </div>
        </div>
      </div>

      <MonthWidget
        withNavigation
        className="hidden w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10 md:block"
        date={selected}
        showSelected={(date) =>
          format(date, "dd/MM/yyyy") === format(selected, "dd/MM/yyyy")
        }
        onDayClick={(date) =>
          dispatch({
            type: "SET_SELECTED",
            payload: {
              selected: date,
            },
          })
        }
        onPreviousClick={() =>
          dispatch({
            type: "VIEW_PREVIOUS",
          })
        }
        onNextClick={() =>
          dispatch({
            type: "VIEW_NEXT",
          })
        }
      />
    </div>
  );
}

export function Header() {
  const {
    state: { selected },
  } = useCalendarContext();

  return (
    <div>
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        <time dateTime="2022-01-22" className="sm:hidden">
          {format(selected, "MMM d, yyyy")}
        </time>
        <time dateTime="2022-01-22" className="hidden sm:inline">
          {format(selected, "MMMM d, yyyy")}
        </time>
      </h1>
      <p className="mt-1 text-sm text-gray-500">{format(selected, "EEEE")}</p>
    </div>
  );
}
