import { Event } from "../../../__generated__/graphql";

export type Day = {
  date: Date;
  events: Event[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type View = "day" | "week" | "month" | "year";
