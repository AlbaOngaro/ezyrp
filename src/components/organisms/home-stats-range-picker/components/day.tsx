import {
  addDays,
  isAfter,
  isSameDay,
  isWithinInterval,
  subDays,
} from "date-fns";
import { Fragment, useRef } from "react";
import { DayProps, useDayRender } from "react-day-picker";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";

export function Day({
  date,
  displayMonth,
  start,
  end,
}: DayProps & { start: string; end: string }) {
  const button = useRef<HTMLButtonElement | null>(null);
  const { isHidden, buttonProps, divProps } = useDayRender(
    date,
    displayMonth,
    button,
  );

  const today = new Date();

  if (isHidden) {
    return <Fragment />;
  }

  if (isAfter(date, today)) {
    const { className, ...rest } = divProps;

    return (
      <div
        className={cn(
          className,
          "text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400",
        )}
        {...rest}
      >
        {date.getDate()}
      </div>
    );
  }

  if (isSameDay(date, start)) {
    return (
      <Button
        size="icon"
        variant="default"
        ref={button}
        {...buttonProps}
        data-testid="home__stats-range-picker--start"
      >
        {date.getDate()}
      </Button>
    );
  }

  if (isSameDay(date, end)) {
    return (
      <Button
        size="icon"
        variant="default"
        className="z-10"
        ref={button}
        {...buttonProps}
        data-testid="home__stats-range-picker--end"
      >
        {date.getDate()}
      </Button>
    );
  }

  if (
    isWithinInterval(date, {
      start: addDays(new Date(start), 1),
      end: subDays(new Date(end), 1),
    })
  ) {
    return (
      <Button
        size="icon"
        variant="secondary"
        className="rounded-none"
        ref={button}
        {...buttonProps}
      >
        {date.getDate()}
      </Button>
    );
  }

  return (
    <Button size="icon" variant="ghost" {...buttonProps}>
      {date.getDate()}
    </Button>
  );
}
