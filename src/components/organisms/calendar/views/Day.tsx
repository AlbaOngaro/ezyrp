import { format, isSameDay } from "date-fns";

import { EventItem } from "../components/EventItem";
import { useCalendarContext } from "../Calendar";
import { Indicator } from "../components/Indicator";

import { MonthWidget } from "components/atoms/month-widget";

import { useSettings } from "hooks/useSettings";

export function Body() {
  const {
    state: { selected, days },
    dispatch,
  } = useCalendarContext();

  const { data } = useSettings();
  const weekDay = selected.getDay() === 0 ? 6 : selected.getDay() - 1;

  const dayStartsAt = (data?.start || 0) - new Date().getTimezoneOffset() / 60;
  const dayEndsAt = (data?.end || 0) - new Date().getTimezoneOffset() / 60;

  return (
    <div className="isolate flex flex-auto overflow-hidden bg-white">
      <div className="flex flex-auto flex-col overflow-auto">
        <div className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden">
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>W</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
              19
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pb-1.5 pt-3"
          >
            <span>T</span>
            <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-orange-500">
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
              className="relative col-start-1 col-end-2 row-start-1 grid grid-cols-1"
              style={{
                gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
              }}
              id="grid"
            >
              {data?.days?.includes(weekDay) ? (
                <>
                  <div
                    className="bg-gray-100/30 pointer-events-none"
                    style={{
                      gridRow: `2 / ${dayStartsAt * 12 + 2}`,
                    }}
                  />

                  <div
                    className="bg-gray-100/30 pointer-events-none"
                    style={{
                      gridRow: `${dayEndsAt * 12 + 2} / 288`,
                    }}
                  />
                </>
              ) : (
                <div
                  className="bg-gray-100/30 pointer-events-none"
                  style={{
                    gridRow: "2 / -1",
                  }}
                />
              )}

              <Indicator />

              {days
                .find((day) => isSameDay(day.date, selected))
                ?.events.map((event) => (
                  <EventItem
                    key={event._id}
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
