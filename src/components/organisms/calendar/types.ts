import { Doc } from "convex/_generated/dataModel";

type Event = Doc<"events">;

export type Day = {
  date: Date;
  events: Event[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type View = "day" | "week" | "month" | "year";
