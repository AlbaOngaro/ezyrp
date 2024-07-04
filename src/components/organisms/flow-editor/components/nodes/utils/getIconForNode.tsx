import {
  Cake,
  CalendarClock,
  CalendarRange,
  Send,
  UserPlus,
} from "lucide-react";
import { Node } from "reactflow";
import {
  NodeData,
  NodeType,
  TriggerNodeData,
} from "components/organisms/flow-editor/types";
import { cn } from "lib/utils/cn";

type Props = Pick<Node<NodeData, NodeType>, "type" | "data"> & {
  variant?: "ghost" | "default";
};

export function getIconForNode({ type, data, variant = "default" }: Props) {
  const className = cn({
    "h-6 w-6": variant === "ghost",
    "p-2 rounded-sm w-8 h-8": variant === "default",
    "bg-orange-300": variant === "default" && type === "trigger",
    "bg-green-300": variant === "default" && type === "action",
  });

  if (type === "action") {
    return <Send className={className} />;
  }

  switch ((data as TriggerNodeData).event) {
    case "customer:created":
      return <UserPlus className={className} />;
    case "customer:birthday":
      return <Cake className={className} />;
    case "event:upcoming":
      return <CalendarClock className={className} />;
    case "event:days-passed":
      return <CalendarRange className={className} />;
    default:
      return null;
  }
}
