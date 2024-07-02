import { Cake, CalendarClock, CalendarRange, UserPlus } from "lucide-react";
import { Node } from "../types";

export function useGetTriggers(): Node[] {
  return [
    {
      type: "trigger",
      icon: <UserPlus className="w-6 h-6" />,
      data: {
        label: "User Creation",
      },
    },
    {
      type: "trigger",
      icon: <Cake className="w-6 h-6" />,
      data: {
        label: "User's Birthday",
      },
    },
    {
      type: "trigger",
      icon: <CalendarClock className="w-6 h-6" />,
      data: {
        label: "Upcoming Event",
      },
    },
    {
      type: "trigger",
      icon: <CalendarRange className="w-6 h-6" />,
      data: {
        label: "Days passed since event",
      },
    },
  ];
}
