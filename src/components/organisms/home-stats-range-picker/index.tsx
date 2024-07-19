import { formatISO, parseISO, subMonths } from "date-fns";
import { Dispatch, SetStateAction } from "react";

import { DateRangePicker } from "../date-range-picker";
import { Day } from "./components/day";
import { Caption } from "./components/caption";

type Props = {
  start: string;
  setStart: Dispatch<SetStateAction<string>>;
  end: string;
  setEnd: Dispatch<SetStateAction<string>>;
};

export function HomeStatsRangePicker({ start, setStart, end, setEnd }: Props) {
  return (
    <DateRangePicker
      testId="home__stats-range-picker"
      defaultMonth={subMonths(parseISO(start), 1)}
      range={{
        from: parseISO(start),
        to: parseISO(end),
      }}
      onChange={(range) => {
        const from = range?.from;
        const to = range?.to;

        if (!!from) {
          setStart(formatISO(from, { representation: "date" }));
        }

        if (!!to) {
          setEnd(formatISO(to, { representation: "date" }));
        }
      }}
      components={{
        Day: (props) => <Day {...props} start={start} end={end} />,
        Caption,
      }}
    />
  );
}
