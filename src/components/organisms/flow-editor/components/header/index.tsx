import { Play, Save } from "lucide-react";
import { Node } from "reactflow";
import { toast } from "sonner";

import { useAction } from "convex/react";

import { get } from "lodash";
import { useOnSave } from "../../hooks/useOnSave";
import { useNodes } from "../../hooks/useNodes";
import { ActionNodeData, SelectSetting, TriggerNodeData } from "../../types";

import { Button } from "components/atoms/button";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function Header() {
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();
  const [nodes] = useNodes();

  const trigger = nodes.find((node) => node.type === "trigger") as
    | Node<TriggerNodeData, "trigger">
    | undefined;
  const action = nodes.find((node) => node.type === "action") as
    | Node<ActionNodeData, "action">
    | undefined;

  const sendEmail = useAction(api.actions.email);

  return (
    <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end gap-4 z-30">
      <Button
        variant="outline"
        size="icon"
        disabled={!trigger || !action}
        onClick={async () => {
          const template = get(action, "data.settings.template");
          if (!template) {
            return;
          }

          toast.promise(
            sendEmail({
              to: "dolcebunny15@gmail.com",
              template: (template as SelectSetting).value.value as Id<"emails">,
            }),
            {
              loading: "Running flow...",
              success: "Test run completeded sucessfully.",
              error: "There was an error running the flow.",
            },
          );
        }}
      >
        <Play className="w-4 h-4" />
      </Button>

      <Button
        className="flex flex-row gap-2"
        loading={isSavingWorkflow}
        onClick={onSave}
      >
        <Save className="w-4 h-4" /> Save
      </Button>
    </header>
  );
}
