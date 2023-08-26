import {
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameWeek,
} from "date-fns";
import { Fragment, useState } from "react";
import { useCalendarContext } from "components/organisms/calendar/Calendar";
import { twMerge } from "lib/utils/twMerge";

function getEventStartRow(startDate: Date, endDate: Date, currentDate: Date) {
  const isLongerThan24Hours = differenceInHours(endDate, startDate) > 24;

  if (isLongerThan24Hours) {
    return 1;
  }

  if (isSameDay(startDate, currentDate)) {
    return (startDate.getHours() * 60) / 5 + 1 + startDate.getMinutes() / 5 + 1;
  }

  return 2;
}

function getEventEndRow(startDate: Date, endDate: Date, currentDate: Date) {
  const isLongerThan24Hours = differenceInHours(endDate, startDate) > 24;

  if (isLongerThan24Hours) {
    return 1;
  }

  if (!isSameDay(endDate, currentDate)) {
    return 288;
  }

  if (isSameDay(startDate, endDate)) {
    return differenceInMinutes(endDate, startDate) / 5;
  }

  return (endDate.getHours() * 60) / 5 + endDate.getMinutes() / 5;
}

function getGridRow(startDate: Date, endDate: Date, currentDate: Date) {
  return `${getEventStartRow(
    startDate,
    endDate,
    currentDate,
  )} / span ${getEventEndRow(startDate, endDate, currentDate)}`;
}

function getIsLongerThan24Hours(startDate: Date, endDate: Date) {
  return differenceInHours(endDate, startDate) > 24;
}

function getGridColumn(startDate: Date, endDate: Date, currentDate: Date) {
  const isLongerThan24Hours = getIsLongerThan24Hours(startDate, endDate);

  if (
    isLongerThan24Hours &&
    isSameWeek(startDate, currentDate, {
      weekStartsOn: 1,
    })
  ) {
    return `${startDate.getDay() === 0 ? 7 : startDate.getDay()} / span ${
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).length
    }`;
  }

  return currentDate.getDay() === 0 ? 7 : currentDate.getDay();
}

export function Body() {
  const [hovering, setHovering] = useState("");

  const {
    state: { days },
  } = useCalendarContext();

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
                gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
              }}
            >
              {days.map((day) => (
                <Fragment key={day.date.toISOString()}>
                  {day.events.map((event) => {
                    const startDate = new Date(event.start);
                    const endDate = new Date(event.end);

                    const gridRow = getGridRow(startDate, endDate, day.date);
                    const gridColumn = getGridColumn(
                      startDate,
                      endDate,
                      day.date,
                    );

                    const isLongerThan24Hours = getIsLongerThan24Hours(
                      startDate,
                      endDate,
                    );

                    if (
                      isLongerThan24Hours &&
                      isSameWeek(day.date, startDate, {
                        weekStartsOn: 1,
                      }) &&
                      !isSameDay(day.date, startDate)
                    ) {
                      return null;
                    }

                    return (
                      <li
                        key={event.id}
                        className={twMerge(
                          "mt-px cursor-pointer flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100",
                          {
                            "rounded-b-none":
                              !isSameDay(startDate, endDate) &&
                              !isSameDay(endDate, day.date),
                            "rounded-t-none":
                              !isSameDay(startDate, endDate) &&
                              isSameDay(endDate, day.date),
                            "rounded-none":
                              (!isSameDay(startDate, day.date) &&
                                !isSameDay(endDate, day.date)) ||
                              isLongerThan24Hours,
                            "bg-blue-100": hovering === event.id,
                            "py-0 justify-center": isLongerThan24Hours,
                          },
                        )}
                        onMouseEnter={() => setHovering(event.id)}
                        onMouseLeave={() => setHovering("")}
                        style={{
                          gridRow,
                          gridColumn,
                        }}
                      >
                        <p className="font-semibold text-blue-700">
                          {event.title}
                        </p>
                        {!isLongerThan24Hours && (
                          <p className="text-blue-500 group-hover:text-blue-700">
                            <time dateTime={event.start}>
                              {format(new Date(event.start), "HH:mm aa")} -{" "}
                              {format(new Date(event.end), "HH:mm aa")}
                            </time>
                          </p>
                        )}
                      </li>
                    );
                  })}
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
