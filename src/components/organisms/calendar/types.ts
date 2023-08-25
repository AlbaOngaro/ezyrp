import { Event } from "lib/types";

export type Day = {
  date: Date;
  events: Event[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type View = "day" | "week" | "month" | "year";
