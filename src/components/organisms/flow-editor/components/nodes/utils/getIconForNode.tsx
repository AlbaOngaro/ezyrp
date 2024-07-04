import {
  Cake,
  CalendarClock,
  CalendarRange,
  HandCoins,
  MessageCircleMore,
  ReceiptText,
  Send,
  UserPlus,
  WalletCards,
} from "lucide-react";
import { Node } from "reactflow";
import {
  isActionNode,
  isTriggerNode,
  NodeData,
  NodeType,
} from "components/organisms/flow-editor/types";
import { cn } from "lib/utils/cn";

type Props = Pick<Node<NodeData, NodeType>, "type" | "data"> & {
  variant?: "ghost" | "default";
};

export function getIconForNode({ variant = "default", ...node }: Props) {
  const className = cn({
    "h-6 w-6": variant === "ghost",
    "p-2 rounded-sm w-8 h-8": variant === "default",
    "bg-orange-300": variant === "default" && isTriggerNode(node),
    "bg-green-300": variant === "default" && isActionNode(node),
  });

  if (isActionNode(node)) {
    switch (node.data.action) {
      case "email":
        return <Send className={className} />;
      case "sms":
        return <MessageCircleMore className={className} />;
      default:
        return null;
    }
  }

  if (isTriggerNode(node)) {
    switch (node.data.event) {
      case "customer:created":
        return <UserPlus className={className} />;
      case "customer:birthday":
        return <Cake className={className} />;
      case "event:upcoming":
        return <CalendarClock className={className} />;
      case "event:days-passed":
        return <CalendarRange className={className} />;
      case "invoice:created":
        return <ReceiptText className={className} />;
      case "invoice:overdue":
        return <WalletCards className={className} />;
      case "invoice:paid":
        return <HandCoins className={className} />;
      default:
        return null;
    }
  }
}
