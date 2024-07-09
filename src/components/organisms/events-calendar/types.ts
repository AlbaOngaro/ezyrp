import { FunctionReturnType } from "convex/server";
import { api } from "convex/_generated/api";

export type Event = FunctionReturnType<typeof api.events.list>[number];

export type Day = {
  date: Date;
  events: Event[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type View = "day" | "week" | "month" | "year";
