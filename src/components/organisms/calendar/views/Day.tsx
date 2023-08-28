import { format, isSameDay } from "date-fns";
import { Root, Trigger } from "@radix-ui/react-popover";

import { twMerge } from "lib/utils/twMerge";

import { MonthWidget } from "components/atoms/month-widget/MonthWidget";

import { useCalendarContext } from "components/organisms/calendar/Calendar";
import {
  getGridRow,
  getIsLongerThan24Hours,
} from "components/organisms/calendar/utils";
import { EventPopover } from "components/organisms/calendar/components/EventPopover";

export function Body() {
  const {
    state: { selected, days },
    dispatch,
  } = useCalendarContext();

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
            >
              {days
                .find((day) => isSameDay(day.date, selected))
                ?.events.map((event) => {
                  const startDate = new Date(event.start);
                  const endDate = new Date(event.end);

                  const gridRow = getGridRow(startDate, endDate, selected);
                  const isLongerThan24Hours = getIsLongerThan24Hours(
                    startDate,
                    endDate,
                  );

                  return (
                    <Root key={event.id}>
                      <Trigger asChild>
                        <li
                          className={twMerge(
                            "mt-px cursor-pointer flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5",
                            {
                              "rounded-b-none":
                                !isSameDay(startDate, endDate) &&
                                !isSameDay(endDate, selected),
                              "rounded-t-none":
                                !isSameDay(startDate, endDate) &&
                                isSameDay(endDate, selected),
                              "rounded-none":
                                (!isSameDay(startDate, selected) &&
                                  !isSameDay(endDate, selected)) ||
                                isLongerThan24Hours,
                              "py-0 justify-center": isLongerThan24Hours,
                              "bg-red-50 hover:bg-red-100":
                                event.variant === "red",
                              "bg-orange-50 hover:bg-orange-100":
                                event.variant === "orange",
                              "bg-yellow-50 hover:bg-yellow-100":
                                event.variant === "yellow",
                              "bg-lime-50 hover:bg-lime-100":
                                event.variant === "lime",
                              "bg-green-5 hover:bg-green-1000":
                                event.variant === "green",
                              "bg-emerald-50 hover:bg-emerald-100":
                                event.variant === "emerald",
                              "bg-teal-50 hover:bg-teal-100":
                                event.variant === "teal",
                              "bg-cyan-50 hover:bg-cyan-100":
                                event.variant === "cyan",
                              "bg-sky-50 hover:bg-sky-100":
                                event.variant === "sky",
                              "bg-blue-50 hover:bg-blue-100":
                                event.variant === "blue",
                              "bg-indigo-50 hover:bg-indigo-100":
                                event.variant === "indigo",
                              "bg-violet-50 hover:bg-violet-100":
                                event.variant === "violet",
                              "bg-purple-50 hover:bg-purple-100":
                                event.variant === "purple",
                              "bg-fuchsia-50 hover:bg-fuchsia-100":
                                event.variant === "fuchsia",
                              "bg-pink-50 hover:bg-pink-100":
                                event.variant === "pink",
                              "bg-rose-50 hover:bg-rose-100":
                                event.variant === "rose",
                            },
                          )}
                          style={{
                            gridRow,
                          }}
                        >
                          <p
                            className={twMerge("font-semibold", {
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
                          {!isLongerThan24Hours && (
                            <p
                              className={twMerge({
                                "text-red-500 group-hover:text-red-700":
                                  event.variant === "red",
                                "text-orange-500 group-hover:text-orange-700":
                                  event.variant === "orange",
                                "text-yellow-500 group-hover:text-yellow-700":
                                  event.variant === "yellow",
                                "text-lime-500 group-hover:text-lime-700":
                                  event.variant === "lime",
                                "text-green-500 group-hover:text-green-700":
                                  event.variant === "green",
                                "text-emerald-500 group-hover:text-emerald-700":
                                  event.variant === "emerald",
                                "text-teal-500 group-hover:text-teal-700":
                                  event.variant === "teal",
                                "text-cyan-500 group-hover:text-cyan-700":
                                  event.variant === "cyan",
                                "text-sky-500 group-hover:text-sky-700":
                                  event.variant === "sky",
                                "text-blue-500 group-hover:text-blue-700":
                                  event.variant === "blue",
                                "text-indigo-500 group-hover:text-indigo-700":
                                  event.variant === "indigo",
                                "text-violet-500 group-hover:text-violet-700":
                                  event.variant === "violet",
                                "text-purple-500 group-hover:text-purple-700":
                                  event.variant === "purple",
                                "text-fuchsia-500 group-hover:text-fuchsia-700":
                                  event.variant === "fuchsia",
                                "text-pink-500 group-hover:text-pink-700":
                                  event.variant === "pink",
                                "text-rose-500 group-hover:text-rose-700":
                                  event.variant === "rose",
                              })}
                            >
                              <time dateTime={event.start}>
                                {format(new Date(event.start), "HH:mm aa")} -{" "}
                                {format(new Date(event.end), "HH:mm aa")}
                              </time>
                            </p>
                          )}
                        </li>
                      </Trigger>

                      <EventPopover
                        event={event}
                        side="bottom"
                        align="center"
                      />
                    </Root>
                  );
                })}
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
