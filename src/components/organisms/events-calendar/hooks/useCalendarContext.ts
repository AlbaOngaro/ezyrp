import { useContext } from "react";
import { CalendarContext } from "..";

export function useCalendarContext() {
  return useContext(CalendarContext);
}
