import { Send } from "lucide-react";

import { Node } from "../types";

import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { ActionNodeData } from "components/organisms/flow-editor/types";

export function useGetAction(): Node<ActionNodeData, "action">[] {
  const { data: emails = [] } = useQuery(api.emails.list);

  return [
    {
      type: "action",
      icon: <Send className="w-6 h-6" />,
      data: {
        label: "Email",
        settings: {
          template: {
            type: "select",
            options: emails.map((email) => ({
              label: email.title || "Unknown email",
              value: email._id,
            })),
            value: {
              label: "Chose",
              value: "chose",
            },
          },
          to: {
            type: "input",
            value: "{{ customer.email }}",
            disabled: true,
          },
        },
      },
    },
  ];
}
