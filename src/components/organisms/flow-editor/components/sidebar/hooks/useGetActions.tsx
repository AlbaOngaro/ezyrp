import { Node } from "../types";

import { ActionNodeData } from "components/organisms/flow-editor/types";

export function useGetAction(): Node<ActionNodeData, "action">[] {
  return [
    {
      type: "action",
      data: {
        label: "Email",
        action: "email",
      },
    },
  ];
}
