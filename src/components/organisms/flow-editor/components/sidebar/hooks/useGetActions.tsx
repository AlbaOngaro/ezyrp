import { Node } from "../types";
import { Id } from "convex/_generated/dataModel";

import { ActionNodeData } from "components/organisms/flow-editor/types";

export function useGetAction(): Node<ActionNodeData, "action">[] {
  return [
    {
      type: "action",
      data: {
        label: "Email",
        action: "email",
        template: undefined as unknown as Id<"emails">,
      },
    },
    {
      type: "action",
      data: {
        label: "SMS",
        action: "sms",
      },
    },
  ];
}
