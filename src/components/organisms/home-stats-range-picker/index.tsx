import { setHours, setMinutes, subMonths } from "date-fns";
import { Dispatch, SetStateAction } from "react";

import { DateRangePicker } from "../date-range-picker";
import { Day } from "./components/day";
import { Caption } from "./components/caption";

type Props = {
  start: number;
  setStart: Dispatch<SetStateAction<number>>;
  end: number;
  setEnd: Dispatch<SetStateAction<number>>;
};

export function HomeStatsRangePicker({ start, setStart, end, setEnd }: Props) {
  return (
    <DateRangePicker
      testId="home__stats-range-picker"
      defaultMonth={subMonths(start, 1)}
      range={{
        from: new Date(start),
        to: new Date(end),
      }}
      onChange={(range) => {
        const from = range?.from;
        const to = range?.to;

        console.log({ from, to });

        if (!!from) {
          setStart(setMinutes(setHours(from, 0), 0).getTime());
        }

        if (!!to) {
          setEnd(setHours(setMinutes(to, 59), 23).getTime());
        }
      }}
      components={{
        Day: (props) => <Day {...props} start={start} end={end} />,
        Caption,
      }}
    />
  );
}
