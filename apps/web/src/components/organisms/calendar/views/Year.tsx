import { format } from "date-fns";
import { MonthWidget } from "../../../atoms/month-widget/MonthWidget";

import { useCalendarContext } from "../Calendar";

export function Body() {
  const {
    state: { selected },
    dispatch,
  } = useCalendarContext();

  return (
    <div className="grid overflow-scroll max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-1 py-16 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 12 }, (_, i) => {
        return new Date(selected.getFullYear(), i);
      }).map((month) => (
        <MonthWidget
          key={month.toISOString()}
          date={month}
          onDayClick={(date) =>
            dispatch({
              type: "SET_SELECTED",
              payload: {
                selected: date,
              },
            })
          }
          showSelected={(date) =>
            format(date, "dd/MM/yyyy") === format(selected, "dd/MM/yyyy")
          }
        />
      ))}
    </div>
  );
}

export function Header() {
  const {
    state: { selected },
  } = useCalendarContext();

  return (
    <h1 className="text-base font-semibold leading-6 text-gray-900">
      <time dateTime={selected.toISOString()}>{selected.getFullYear()}</time>
    </h1>
  );
}
