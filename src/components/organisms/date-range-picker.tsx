import React, { HTMLAttributes, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, DayPickerProps } from "react-day-picker";

import { Button } from "components/atoms/button";
import { Calendar } from "components/atoms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/atoms/popover";
import { cn } from "lib/utils/cn";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> &
  DayPickerProps & {
    range: DateRange;
    onChange: (range?: DateRange) => void;
  };

const defaultRange = {
  from: new Date(2022, 0, 20),
  to: addDays(new Date(2022, 0, 20), 20),
};

export function DateRangePicker({
  className,
  onChange,
  range = defaultRange,
  defaultMonth,
  ...rest
}: Props) {
  const [date, setDate] = useState<DateRange>(range);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={defaultMonth || date?.from}
            selected={date}
            // @ts-ignore
            onSelect={(date) => {
              if (date) {
                setDate(date);
              }

              if (typeof onChange == "function") {
                onChange(date);
              }
            }}
            numberOfMonths={2}
            {...rest}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
