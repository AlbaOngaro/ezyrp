import { useMemo, useState } from "react";
import {
  getDaysInMonth,
  isToday,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { twMerge } from "lib/utils/twMerge";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";

type Day = {
  date: Date;
  events: {
    id: number;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

interface Props {
  className?: string;
}

type View = "day" | "week" | "month" | "year";

const views = [
  {
    value: "day",
    label: "Day view",
    disabled: false,
  },
  {
    value: "week",
    label: "Week view",
    disabled: false,
  },
  {
    value: "month",
    label: "Month view",
    disabled: false,
  },
  {
    value: "year",
    label: "Year view",
    disabled: true,
  },
];

export function Calendar({ className }: Props) {
  const [selected, setSelected] = useState(() => new Date());
  const [view, setView] = useState<View>("day");

  const days = useMemo<Day[]>(() => {
    switch (view) {
      case "month":
      case "day": {
        const total = getDaysInMonth(selected);

        const year = selected.getFullYear();
        const month = selected.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month, total).getDay();

        return [
          Array.from(
            { length: firstDay - 1 > 0 ? firstDay - 1 : 6 },
            (_, day) => new Date(year, month, day * -1),
          ).reverse(),
          Array.from(
            { length: total },
            (_, day) => new Date(year, month, day + 1),
          ),
          Array.from(
            { length: lastDay !== 0 ? 7 - lastDay : 0 },
            (_, day) => new Date(year, month, total + (day + 1)),
          ),
        ].flatMap((dates) =>
          dates.map((date) => ({
            date,
            isCurrentMonth: isSameMonth(date, selected),
            isToday: isToday(date),
            events: [],
          })),
        );
      }
      case "week": {
        const year = selected.getFullYear();
        const month = selected.getMonth();
        const date = selected.getDate();
        const day = selected.getDay() === 0 ? 6 : selected.getDay() - 1;

        return Array.from({ length: 7 }, (_, index) => {
          if (index === day) {
            return selected;
          }

          return new Date(year, month, date - (day - index));
        }).map((date) => ({
          date, // format(date, "EEE d"),
          isCurrentMonth: isSameMonth(date, selected),
          isToday: isToday(date),
          events: [],
        }));
      }
      default:
        return [];
    }
  }, [selected, view]);

  return (
    <div className={twMerge("lg:flex lg:h-full lg:flex-col", className)}>
      <header className="flex items-center justify-between border-b border-gray-200 py-6 lg:flex-none">
        {(() => {
          switch (view) {
            case "day":
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
                  <p className="mt-1 text-sm text-gray-500">
                    {format(selected, "EEEE")}
                  </p>
                </div>
              );
            default:
              return (
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  <time dateTime={selected.toISOString()}>
                    {format(selected, "MMMM yyyy")}
                  </time>
                </h1>
              );
          }
        })()}
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={() =>
                setSelected((curr) => {
                  const year = curr.getFullYear();
                  const month = curr.getMonth();
                  const date = curr.getDate();

                  switch (view) {
                    case "month":
                      return new Date(year, month - 1, date);
                    case "week":
                      return new Date(year, month, date - 7);
                    case "day":
                      return new Date(year, month, date - 1);
                    default:
                      return curr;
                  }
                })
              }
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={() => setSelected(new Date())}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={() =>
                setSelected((curr) => {
                  const year = curr.getFullYear();
                  const month = curr.getMonth();
                  const date = curr.getDate();

                  switch (view) {
                    case "month":
                      return new Date(year, month + 1, date);
                    case "week":
                      return new Date(year, month, date + 7);
                    case "day":
                      return new Date(year, month, date + 1);
                    default:
                      return curr;
                  }
                })
              }
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Select
              name="views"
              className="min-w-[150px]"
              defaultValue={view}
              options={views}
              onChange={(value) => setView(value as View)}
            />

            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Button size="lg">Add event</Button>
          </div>
        </div>
      </header>

      {(() => {
        switch (view) {
          case "month":
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
                  <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
                    {days.map((day) => (
                      <div
                        key={day.date.toISOString()}
                        className={twMerge(
                          "relative px-3 py-2 bg-gray-50 text-gray-500",
                          {
                            "bg-white": day.isCurrentMonth,
                          },
                        )}
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
                        {day.events.length > 0 && (
                          <ol className="mt-2">
                            {day.events.slice(0, 2).map((event) => (
                              <li key={event.id}>
                                <a href={event.href} className="group flex">
                                  <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                                    {event.name}
                                  </p>
                                  <time
                                    dateTime={event.datetime}
                                    className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                                  >
                                    {event.time}
                                  </time>
                                </a>
                              </li>
                            ))}
                            {day.events.length > 2 && (
                              <li className="text-gray-500">
                                + {day.events.length - 2} more
                              </li>
                            )}
                          </ol>
                        )}
                      </div>
                    ))}
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
                              !day.isSelected &&
                              day.isCurrentMonth &&
                              !day.isToday,
                            "text-gray-500":
                              !day.isSelected &&
                              !day.isCurrentMonth &&
                              !day.isToday,
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
                          {format(day.date, "dd/MM/yyyy")}
                        </time>
                        <span className="sr-only">
                          {day.events.length} events
                        </span>
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
          case "week":
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
                        className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                        style={{
                          gridTemplateRows:
                            "1.75rem repeat(288, minmax(0, 1fr)) auto",
                        }}
                      >
                        <li
                          className="relative mt-px flex sm:col-start-3"
                          style={{ gridRow: "74 / span 12" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                          >
                            <p className="order-1 font-semibold text-blue-700">
                              Breakfast
                            </p>
                            <p className="text-blue-500 group-hover:text-blue-700">
                              <time dateTime="2022-01-12T06:00">6:00 AM</time>
                            </p>
                          </a>
                        </li>
                        <li
                          className="relative mt-px flex sm:col-start-3"
                          style={{ gridRow: "92 / span 30" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                          >
                            <p className="order-1 font-semibold text-pink-700">
                              Flight to Paris
                            </p>
                            <p className="text-pink-500 group-hover:text-pink-700">
                              <time dateTime="2022-01-12T07:30">7:30 AM</time>
                            </p>
                          </a>
                        </li>
                        <li
                          className="relative mt-px hidden sm:col-start-6 sm:flex"
                          style={{ gridRow: "122 / span 24" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200"
                          >
                            <p className="order-1 font-semibold text-gray-700">
                              Meeting with design team at Disney
                            </p>
                            <p className="text-gray-500 group-hover:text-gray-700">
                              <time dateTime="2022-01-15T10:00">10:00 AM</time>
                            </p>
                          </a>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            );
          case "day":
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
                          gridTemplateRows:
                            "1.75rem repeat(288, minmax(0, 1fr)) auto",
                        }}
                      >
                        <li
                          className="relative mt-px flex"
                          style={{ gridRow: "74 / span 12" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                          >
                            <p className="order-1 font-semibold text-blue-700">
                              Breakfast
                            </p>
                            <p className="text-blue-500 group-hover:text-blue-700">
                              <time dateTime="2022-01-22T06:00">6:00 AM</time>
                            </p>
                          </a>
                        </li>
                        <li
                          className="relative mt-px flex"
                          style={{ gridRow: "92 / span 30" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                          >
                            <p className="order-1 font-semibold text-pink-700">
                              Flight to Paris
                            </p>
                            <p className="order-1 text-pink-500 group-hover:text-pink-700">
                              John F. Kennedy International Airport
                            </p>
                            <p className="text-pink-500 group-hover:text-pink-700">
                              <time dateTime="2022-01-22T07:30">7:30 AM</time>
                            </p>
                          </a>
                        </li>
                        <li
                          className="relative mt-px flex"
                          style={{ gridRow: "134 / span 18" }}
                        >
                          <a
                            href="#"
                            className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-5 hover:bg-indigo-100"
                          >
                            <p className="order-1 font-semibold text-indigo-700">
                              Sightseeing
                            </p>
                            <p className="order-1 text-indigo-500 group-hover:text-indigo-700">
                              Eiffel Tower
                            </p>
                            <p className="text-indigo-500 group-hover:text-indigo-700">
                              <time dateTime="2022-01-22T11:00">11:00 AM</time>
                            </p>
                          </a>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                <div className="hidden w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10 md:block">
                  <div className="flex items-center text-center text-gray-900">
                    <button
                      type="button"
                      className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                      onClick={() =>
                        setSelected((curr) => {
                          const year = curr.getFullYear();
                          const month = curr.getMonth();
                          const date = curr.getDate();

                          return new Date(year, month - 1, date);
                        })
                      }
                    >
                      <span className="sr-only">Previous month</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="flex-auto text-sm font-semibold">
                      {format(selected, "MMMM yyyy")}
                    </div>
                    <button
                      type="button"
                      className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                      onClick={() =>
                        setSelected((curr) => {
                          const year = curr.getFullYear();
                          const month = curr.getMonth();
                          const date = curr.getDate();

                          return new Date(year, month + 1, date);
                        })
                      }
                    >
                      <span className="sr-only">Next month</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                    <div>S</div>
                  </div>
                  <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                    {days.map((day, dayIdx) => (
                      <button
                        key={day.date.toISOString()}
                        onClick={() => setSelected(day.date)}
                        type="button"
                        className={twMerge(
                          "py-1.5 hover:bg-gray-100 focus:z-10",
                          day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                          (day.isSelected || day.isToday) && "font-semibold",
                          day.isSelected && "text-white",
                          !day.isSelected &&
                            day.isCurrentMonth &&
                            !day.isToday &&
                            "text-gray-900",
                          !day.isSelected &&
                            !day.isCurrentMonth &&
                            !day.isToday &&
                            "text-gray-400",
                          day.isToday && !day.isSelected && "text-indigo-600",
                          dayIdx === 0 && "rounded-tl-lg",
                          dayIdx === 6 && "rounded-tr-lg",
                          dayIdx === days.length - 7 && "rounded-bl-lg",
                          dayIdx === days.length - 1 && "rounded-br-lg",
                        )}
                      >
                        <time
                          dateTime={day.date.toISOString()}
                          className={twMerge(
                            {
                              "bg-indigo-600 text-white":
                                isSameDay(selected, day.date) && day.isToday,
                              "bg-gray-900 text-white":
                                isSameDay(selected, day.date) && !day.isToday,
                            },
                            "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                          )}
                        >
                          {day.date.getDate()}
                        </time>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
