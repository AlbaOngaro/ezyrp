import { Dispatch, ReactNode, createContext, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { getDaysInMonth } from "date-fns";
import { View } from "./types";
import {
  State,
  defaultInitialState,
  Action,
  useCalendarReducer,
  getInitialStateForSelectedDate,
} from "./hooks/useCalendarReducer";

import * as MonthView from "./views/Month";
import * as WeekView from "./views/week";
import * as DayView from "./views/Day";
import * as YearView from "./views/Year";
import { Event } from "./types";

import { cn } from "lib/utils/cn";
import { Select } from "components/atoms/select";

export const CalendarContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: defaultInitialState,
  dispatch: () => undefined,
});

interface Props {
  className?: string;
  actions?: ReactNode;
  events?: Event[];
  onPrevious?: () => void;
  onToday?: () => void;
  onNext?: () => void;
  onChange?: (date: Date) => void;
  onViewChange?: (start: Date, end: Date) => void;
  selected?: Date;
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

export function EventsCalendar({
  className,
  actions,
  events,
  onPrevious,
  onToday,
  onNext,
  onChange,
  onViewChange,
  selected: initialSelected = new Date(),
}: Props) {
  const [{ selected, days, view }, dispatch] = useCalendarReducer(
    getInitialStateForSelectedDate(initialSelected),
  );

  useEffect(() => {
    if (events) {
      dispatch({
        type: "SET_EVENTS",
        payload: {
          events,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selected, view]);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (typeof onViewChange === "function") {
      switch (view) {
        case "day":
          onViewChange(selected, selected);
          break;
        case "week":
          onViewChange(days[0].date, days[days.length - 1].date);
          break;
        case "month": {
          const total = getDaysInMonth(selected);
          const year = selected.getFullYear();
          const month = selected.getMonth();

          const start = new Date(year, month, 1);
          const end = new Date(year, month, total);

          onViewChange(start, end);
          break;
        }
        case "year": {
          const year = selected.getFullYear();

          const start = new Date(year, 0, 1);
          const end = new Date(year, 11, 31);

          onViewChange(start, end);
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, days]);

  return (
    <div className={cn("lg:flex lg:h-full lg:flex-col", className)}>
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
        <header className="flex items-center justify-between border-b border-gray-200 py-6 lg:flex-none">
          {(() => {
            switch (view) {
              case "day":
                return <DayView.Header />;
              case "week":
                return <WeekView.Header />;
              case "month":
                return <MonthView.Header />;
              case "year":
                return <YearView.Header />;
              default:
                return null;
            }
          })()}

          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                onClick={() => {
                  dispatch({
                    type: "VIEW_PREVIOUS",
                  });

                  if (typeof onPrevious === "function") {
                    onPrevious();
                  }
                }}
              >
                <span className="sr-only">Previous {view}</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                onClick={() => {
                  dispatch({
                    type: "SET_SELECTED",
                    payload: {
                      selected: new Date(),
                    },
                  });

                  if (typeof onToday === "function") {
                    onToday();
                  }
                }}
              >
                Today
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                onClick={() => {
                  dispatch({
                    type: "VIEW_NEXT",
                  });

                  if (typeof onNext === "function") {
                    onNext();
                  }
                }}
              >
                <span className="sr-only">Next {view}</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden md:ml-4 md:flex md:items-center gap-4">
              <Select
                name="views"
                className="min-w-[150px]"
                // @ts-ignore
                defaultValue={{
                  label: view,
                  value: view,
                }}
                options={views}
                onChange={(option) =>
                  dispatch({
                    type: "SET_VIEW",
                    payload: {
                      view: option?.value as View,
                    },
                  })
                }
              />

              {actions}
            </div>
          </div>
        </header>

        {(() => {
          switch (view) {
            case "day":
              return <DayView.Body />;
            case "week":
              return <WeekView.Body />;
            case "month":
              return <MonthView.Body />;
            case "year":
              return <YearView.Body />;
            default:
              return null;
          }
        })()}
      </CalendarContext.Provider>
    </div>
  );
}
