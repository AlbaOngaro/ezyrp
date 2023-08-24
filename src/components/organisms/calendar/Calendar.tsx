import { useMemo, useState } from "react";
import {
  getDaysInMonth,
  sub,
  add,
  isToday,
  format,
  isSameMonth,
} from "date-fns";
import * as Menu from "@radix-ui/react-navigation-menu";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

import { twMerge } from "lib/utils/twMerge";
import { Button } from "components/atoms/button/Button";

type Day = {
  date: string;
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

const views = [
  {
    id: "day",
    label: "Day view",
    disabled: true,
  },
  {
    id: "week",
    label: "Week view",
    disabled: false,
  },
  {
    id: "month",
    label: "Month view",
    disabled: true,
  },
  {
    id: "year",
    label: "Year view",
    disabled: true,
  },
];

export function Calendar({ className }: Props) {
  const [selected, setSelected] = useState(() => new Date());

  const days = useMemo<Day[]>(() => {
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
      Array.from({ length: total }, (_, day) => new Date(year, month, day + 1)),
      Array.from(
        { length: lastDay !== 0 ? 7 - lastDay : 0 },
        (_, day) => new Date(year, month, total + (day + 1)),
      ),
    ].flatMap((dates) =>
      dates.map((date) => ({
        date: format(date, "dd/MM/yyyy"),
        isCurrentMonth: isSameMonth(date, selected),
        isToday: isToday(date),
        events: [],
      })),
    );
  }, [selected]);

  return (
    <div className={twMerge("lg:flex lg:h-full lg:flex-col", className)}>
      <header className="flex items-center justify-between border-b border-gray-200 py-6 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime="2022-01">{format(selected, "MMMM yyyy")}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={() =>
                setSelected((curr) => {
                  const date = sub(curr, {
                    months: 1,
                  });

                  date.setDate(1);

                  return date;
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
                  const date = add(curr, {
                    months: 1,
                  });

                  date.setDate(1);

                  return date;
                })
              }
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu.Root className="relative">
              <Menu.List>
                <Menu.Item>
                  <Menu.Trigger asChild>
                    <Button variant="tertiary" size="lg" className="flex gap-2">
                      Month view
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {views.map((item) => (
                      <Menu.Link asChild key={item.id}>
                        <button
                          disabled={item.disabled}
                          className={twMerge(
                            "block px-3 py-1 text-sm text-left leading-6 text-gray-900 w-full hover:bg-slate-50 disabled:text-gray-500 disabled:hover:bg-white",
                          )}
                        >
                          {item.label}
                        </button>
                      </Menu.Link>
                    ))}
                  </Menu.Content>
                </Menu.Item>
              </Menu.List>
            </Menu.Root>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Button size="lg">Add event</Button>
          </div>
        </div>
      </header>

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
                key={day.date}
                className={twMerge(
                  "relative px-3 py-2 bg-gray-50 text-gray-500",
                  {
                    "bg-white": day.isCurrentMonth,
                  },
                )}
              >
                <time
                  dateTime={day.date}
                  className={twMerge({
                    "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white":
                      day.isToday,
                  })}
                >
                  {day.date}
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
                key={day.date}
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
                  dateTime={day.date}
                  className={twMerge(
                    day.isSelected &&
                      "flex h-6 w-6 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && "bg-indigo-600",
                    day.isSelected && !day.isToday && "bg-gray-900",
                    "ml-auto",
                  )}
                >
                  {day.date}
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
    </div>
  );
}
