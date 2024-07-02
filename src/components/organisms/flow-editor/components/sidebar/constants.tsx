import {
  Cake,
  CalendarClock,
  CalendarRange,
  Send,
  UserPlus,
} from "lucide-react";
import { Node } from "./types";

export const TRIGGERS: Node[] = [
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

export const ACTIONS: Node[] = [
  {
    type: "action",
    icon: <Send className="w-6 h-6" />,
    data: {
      label: "Email",
    },
  },
];
