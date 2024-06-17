import { Reducer, useReducer } from "react";
import {
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
} from "date-fns";

import { Event } from "../../../__generated__/graphql";
import { Day, View } from "./types";

export type State = {
  selected: Date;
  view: View;
  days: Day[];
};

type SetSelectedAction = {
  type: "SET_SELECTED";
  payload: {
    selected: Date;
  };
};

type SetViewAction = {
  type: "SET_VIEW";
  payload: {
    view: View;
  };
};

type ViewNextAction = {
  type: "VIEW_NEXT";
};

type ViewPreviousAction = {
  type: "VIEW_PREVIOUS";
};

type SetEventsAction = {
  type: "SET_EVENTS";
  payload: {
    events: Event[];
  };
};

export type Action =
  | SetSelectedAction
  | SetViewAction
  | ViewNextAction
  | ViewPreviousAction
  | SetEventsAction;

export function generateMonth(base: Date): Day[] {
  const total = getDaysInMonth(base);

  const year = base.getFullYear();
  const month = base.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month, total).getDay();

  const toAddBefore = firstDay === 1 ? 0 : firstDay - 1 > 0 ? firstDay - 1 : 6;
  const toAddAfter = lastDay !== 0 ? 7 - lastDay : 0;

  return [
    Array.from(
      { length: toAddBefore },
      (_, day) => new Date(year, month, day * -1),
    ).reverse(),
    Array.from({ length: total }, (_, day) => new Date(year, month, day + 1)),
    Array.from(
      {
        length:
          toAddBefore + total + toAddAfter === 42
            ? toAddAfter
            : 42 - (toAddBefore + total + toAddAfter) + toAddAfter,
      },
      (_, day) => new Date(year, month, total + (day + 1)),
    ),
  ].flatMap((dates) =>
    dates.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, base),
      isToday: isToday(date),
      events: [],
    })),
  );
}

export function generateWeek(base: Date): Day[] {
  const year = base.getFullYear();
  const month = base.getMonth();
  const date = base.getDate();
  const day = base.getDay() === 0 ? 6 : base.getDay() - 1;

  return Array.from({ length: 7 }, (_, index) => {
    if (index === day) {
      return base;
    }

    return new Date(year, month, date - (day - index));
  }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, base),
    isToday: isToday(date),
    events: [],
  }));
}

export const defaultInitialState: State = {
  selected: new Date(),
  view: "week",
  days: generateWeek(new Date()),
};

const reducer: Reducer<State, Action> = (
  state = defaultInitialState,
  action,
) => {
  switch (action.type) {
    case "SET_SELECTED": {
      const { selected } = action.payload;

      switch (state.view) {
        case "month":
        case "day": {
          return {
            ...state,
            selected,
            days: generateMonth(selected),
          };
        }
        case "week": {
          const year = selected.getFullYear();
          const month = selected.getMonth();
          const date = selected.getDate();
          const day = selected.getDay() === 0 ? 6 : selected.getDay() - 1;

          return {
            ...state,
            selected,
            days: Array.from({ length: 7 }, (_, index) => {
              if (index === day) {
                return selected;
              }

              return new Date(year, month, date - (day - index));
            }).map((date) => ({
              date, // format(date, "EEE d"),
              isCurrentMonth: isSameMonth(date, selected),
              isToday: isToday(date),
              events: [],
            })),
          };
        }
        default:
          return {
            ...state,
            selected,
          };
      }
    }
    case "SET_VIEW": {
      const { view } = action.payload;
      const { selected } = state;

      switch (view) {
        case "month":
        case "day": {
          return {
            ...state,
            view,
            days: generateMonth(selected),
          };
        }
        case "week": {
          return {
            ...state,
            view,
            days: generateWeek(state.selected),
          };
        }
        default:
          return {
            ...state,
            view,
          };
      }
    }
    case "VIEW_NEXT": {
      const { selected: curr, view } = state;

      const year = curr.getFullYear();
      const month = curr.getMonth();
      const date = curr.getDate();

      switch (view) {
        case "month": {
          const selected = new Date(year, month + 1, date);

          return {
            ...state,
            selected,
            days: generateMonth(selected),
          };
        }
        case "week": {
          const selected = new Date(year, month, date + 7);
          return {
            ...state,
            selected,
            days: generateWeek(selected),
          };
        }
        case "day": {
          const selected = new Date(year, month, date + 1);
          return {
            ...state,
            selected,
            days: generateMonth(selected),
          };
        }
        case "year":
          return {
            ...state,
            selected: new Date(year + 1, month, date),
          };
        default:
          return state;
      }
    }
    case "VIEW_PREVIOUS": {
      const { selected: curr, view } = state;

      const year = curr.getFullYear();
      const month = curr.getMonth();
      const date = curr.getDate();

      switch (view) {
        case "month": {
          const selected = new Date(year, month - 1, date);

          return {
            ...state,
            selected,
            days: generateMonth(selected),
          };
        }
        case "week": {
          const selected = new Date(year, month, date - 7);
          return {
            ...state,
            selected,
            days: generateWeek(selected),
          };
        }
        case "day": {
          const selected = new Date(year, month, date - 1);
          return {
            ...state,
            selected,
            days: generateMonth(selected),
          };
        }
        case "year":
          return {
            ...state,
            selected: new Date(year - 1, month, date),
          };
        default:
          return state;
      }
    }
    case "SET_EVENTS": {
      return {
        ...state,
        days: state.days.map((day) => ({
          ...day,
          events: action.payload.events.filter((event) => {
            switch (state.view) {
              default: {
                const { date } = day;
                const start = new Date(event.start);
                const end = new Date(event.end);

                if (isSameDay(start, end)) {
                  return isSameDay(start, date);
                }

                date.setHours(0, 0);
                start.setHours(0, 0);
                end.setHours(0, 0);

                try {
                  return isWithinInterval(date, {
                    start,
                    end,
                  });
                } catch (error: unknown) {
                  console.error(error);
                  return false;
                }
              }
            }
          }),
        })),
      };
    }
    default:
      return state;
  }
};

export function useCalendarReducer(initialState = defaultInitialState) {
  return useReducer<Reducer<State, Action>>(reducer, initialState);
}
