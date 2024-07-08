import { useEffect, useRef } from "react";
import { isSameDay } from "date-fns";
import { convertRemToPx } from "../../../../lib/utils/convertRemToPx";
import { useCalendarContext } from "../hooks/useCalendarContext";

function getIndicatorTopValue(): string {
  const HALF_HOUR_CELL = 3.5; // cells are set to 3.5rem
  const date = new Date();
  const hour = date.getHours() * 2 * convertRemToPx(HALF_HOUR_CELL);
  const minutes = convertRemToPx(HALF_HOUR_CELL * 2) * (date.getMinutes() / 60);

  return `calc(1.75rem + ${hour}px + ${minutes}px)`;
}

export function Indicator() {
  const {
    state: { view, selected },
  } = useCalendarContext();

  const indicator = useRef<HTMLHRElement | null>(null);

  useEffect(() => {
    if (indicator.current) {
      const day = new Date().getDay();

      indicator.current.style.gridColumnStart = (
        day === 0 ? 7 : day
      ).toString();
      indicator.current.style.gridColumnEnd = `span 1`;
      indicator.current.style.top = getIndicatorTopValue();
      indicator.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const it = setInterval(() => {
      if (indicator.current) {
        indicator.current.style.top = getIndicatorTopValue();
      }
    }, 1000 * 60); // every minute

    return () => {
      clearInterval(it);
    };
  }, [view]);

  if (!isSameDay(new Date(), selected)) {
    return null;
  }

  return (
    <hr
      ref={indicator}
      className="absolute overflow-visible left-0 right-0 border-red-500 before:content-[''] before:block before:w-2 before:h-2 before:absolute before:bg-red-500 before:rounded-full before:-translate-y-1/2 before:-translate-x-1/2"
    />
  );
}
