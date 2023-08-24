import { useMemo } from "react";
import {
  getDaysInMonth,
  sub,
  add,
  isThisMonth,
  isToday,
  format,
} from "date-fns";

import { twMerge } from "lib/utils/twMerge";

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

export function Calendar({ className }: Props) {
  const days = useMemo<Day[]>(() => {
    const now = new Date();
    const days = getDaysInMonth(now);

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const lastDay = new Date(now.getFullYear(), now.getMonth(), days).getDay();

    return [
      Array.from({ length: firstDay - 1 > 0 ? firstDay - 1 : 6 }, (_, day) =>
        sub(new Date(now.getFullYear(), now.getMonth(), days - day), {
          months: 1,
        }),
      ).reverse(),
      Array.from(
        { length: days },
        (_, day) => new Date(now.getFullYear(), now.getMonth(), day + 1),
      ),
      Array.from({ length: lastDay !== 0 ? 7 - lastDay : 0 }, (_, day) =>
        add(new Date(now.getFullYear(), now.getMonth(), day + 1), {
          months: 1,
        }),
      ),
    ].flatMap((dates) =>
      dates.map((date) => ({
        date: format(date, "dd/MM/yyyy"),
        isCurrentMonth: isThisMonth(date),
        isToday: isToday(date),
        events: [],
      })),
    );
  }, []);

  return (
    <div className={twMerge("lg:flex lg:h-full lg:flex-col", className)}>
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
