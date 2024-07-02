import { Cake, CalendarClock, CalendarRange, UserPlus } from "lucide-react";
import { Node } from "../types";
import { TriggerNodeData } from "components/organisms/flow-editor/types";

export function useGetTriggers(): Node<TriggerNodeData, "trigger">[] {
  return [
    {
      type: "trigger",
      icon: <UserPlus className="w-6 h-6" />,
      data: {
        label: "Customer Creation",
        event: "customer:created",
      },
    },
    {
      type: "trigger",
      icon: <Cake className="w-6 h-6" />,
      data: {
        label: "Customer's Birthday",
        event: "customer:birthday",
      },
    },
    {
      type: "trigger",
      icon: <CalendarClock className="w-6 h-6" />,
      data: {
        label: "Upcoming Event",
        event: "event:upcoming",
      },
    },
    {
      type: "trigger",
      icon: <CalendarRange className="w-6 h-6" />,
      data: {
        label: "Days passed since event",
        event: "event:days-passed",
      },
    },
  ];
}
