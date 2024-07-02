import { Cake, CalendarClock, CalendarRange, UserPlus } from "lucide-react";
import { Node } from "../types";
import { TriggerNodeData } from "components/organisms/flow-editor/types";

export function useGetTriggers(): Node<TriggerNodeData, "trigger">[] {
  return [
    {
      type: "trigger",
      data: {
        label: "Customer Creation",
        event: "customer:created",
      },
    },
    {
      type: "trigger",
      data: {
        label: "Customer's Birthday",
        event: "customer:birthday",
      },
    },
    {
      type: "trigger",
      data: {
        label: "Upcoming Event",
        event: "event:upcoming",
      },
    },
    {
      type: "trigger",
      data: {
        label: "Days passed since event",
        event: "event:days-passed",
      },
    },
  ];
}
