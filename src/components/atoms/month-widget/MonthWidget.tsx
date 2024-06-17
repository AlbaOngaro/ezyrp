import { format, isToday } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { twMerge } from "../../../lib/utils/twMerge";
import {
  generateMonth,
  useCalendarReducer,
} from "../../organisms/calendar/useCalendarReducer";

interface Props {
  className?: string;
  date: Date;
  onDayClick?: (date: Date) => void;
  withNavigation?: boolean;
  onNextClick?: () => void;
  onPreviousClick?: () => void;
  showSelected?: (date: Date) => boolean;
  isDayDisabled?: (date: Date) => boolean;
  isPrevDisabled?: (date: Date) => boolean;
  isNextDisabled?: (date: Date) => boolean;
}

export function MonthWidget({
  date,
  className,
  withNavigation,
  onNextClick,
  onPreviousClick,
  onDayClick,
  showSelected,
  isDayDisabled,
  isPrevDisabled,
  isNextDisabled,
}: Props) {
  const [{ selected, days }, dispatch] = useCalendarReducer({
    view: "month",
    selected: date,
    days: generateMonth(date),
  });

  useEffect(() => {
    dispatch({
      type: "SET_SELECTED",
      payload: {
        selected: date,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className={twMerge("text-center", className)}>
      <div className="flex items-center text-center text-gray-900">
        {withNavigation && (
          <button
            type="button"
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 disabled:cursor-not-allowed hover:[&:not(:disabled)]:text-gray-500"
            onClick={() => {
              if (typeof onPreviousClick === "function") {
                onPreviousClick();
              } else {
                dispatch({
                  type: "VIEW_PREVIOUS",
                });
              }
            }}
            disabled={
              typeof isPrevDisabled === "function"
                ? isPrevDisabled(selected)
                : false
            }
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <div className="flex-auto text-sm font-semibold">
          {format(selected, "MMMM yyyy")}
        </div>
        {withNavigation && (
          <button
            type="button"
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={() => {
              if (typeof onNextClick === "function") {
                onNextClick();
              } else {
                dispatch({
                  type: "VIEW_NEXT",
                });
              }
            }}
            disabled={
              typeof isNextDisabled === "function"
                ? isNextDisabled(selected)
                : false
            }
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
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
            disabled={
              typeof isDayDisabled === "function"
                ? isDayDisabled(day.date)
                : false
            }
            key={day.date.toISOString()}
            onClick={() => {
              dispatch({
                type: "SET_SELECTED",
                payload: {
                  selected: day.date,
                },
              });

              if (typeof onDayClick === "function") {
                onDayClick(day.date);
              }
            }}
            type="button"
            className={twMerge(
              "py-1.5 hover:bg-gray-100 focus:z-10 disabled:bg-gray-50 disabled:cursor-not-allowed",
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
              day.isToday && !day.isSelected && "text-orange-500",
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
                  "bg-orange-500 text-white":
                    typeof showSelected === "function"
                      ? showSelected(day.date) && isToday(day.date)
                      : false,
                  "bg-gray-900 text-white":
                    typeof showSelected === "function"
                      ? showSelected(day.date) && !isToday(day.date)
                      : false,
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
  );
}
