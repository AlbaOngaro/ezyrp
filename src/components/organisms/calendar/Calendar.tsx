import { Dispatch, createContext, useContext } from "react";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { View } from "./types";
import { State, initialState, Action } from "./useCalendarReducer";

import { twMerge } from "lib/utils/twMerge";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";
import { useCalendarReducer } from "components/organisms/calendar/useCalendarReducer";
import { MonthView } from "components/organisms/calendar/views/Month";
import { WeekView } from "components/organisms/calendar/views/Week";
import { DayView } from "components/organisms/calendar/views/Day";
import { YearView } from "components/organisms/calendar/views/Year";

const CalendarContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export function useCalendarContext() {
  return useContext(CalendarContext);
}

interface Props {
  className?: string;
}

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
    disabled: false,
  },
];

export function Calendar({ className }: Props) {
  const [{ selected, days, view }, dispatch] = useCalendarReducer();

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
            case "year":
              return (
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  <time dateTime={selected.toISOString()}>
                    {selected.getFullYear()}
                  </time>
                </h1>
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
                dispatch({
                  type: "VIEW_PREVIOUS",
                })
              }
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={() =>
                dispatch({
                  type: "SET_SELECTED",
                  payload: {
                    selected: new Date(),
                  },
                })
              }
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={() =>
                dispatch({
                  type: "VIEW_NEXT",
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
              onChange={(value) =>
                dispatch({
                  type: "SET_VIEW",
                  payload: {
                    view: value as View,
                  },
                })
              }
            />

            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Button size="lg">Add event</Button>
          </div>
        </div>
      </header>

      <CalendarContext.Provider
        value={{
          state: {
            selected,
            days,
            view,
          },
          dispatch,
        }}
      >
        {(() => {
          switch (view) {
            case "month":
              return <MonthView />;
            case "week":
              return <WeekView />;
            case "day":
              return <DayView />;
            case "year":
              return <YearView />;
            default:
              return null;
          }
        })()}
      </CalendarContext.Provider>
    </div>
  );
}
