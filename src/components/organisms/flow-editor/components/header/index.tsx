import { Play, Save } from "lucide-react";
import { Node } from "reactflow";

import { useOnSave } from "../../hooks/useOnSave";

import { useNodes } from "../../hooks/useNodes";
import { ActionNodeData, TriggerNodeData } from "../../types";
import { RunWorkflowModal } from "./run-workflow-modal";

import { Button } from "components/atoms/button";
import { ModalRoot, ModalTrigger } from "components/atoms/modal";

export function Header() {
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();
  const [nodes] = useNodes();

  const trigger = nodes.find((node) => node.type === "trigger") as
    | Node<TriggerNodeData, "trigger">
    | undefined;
  const action = nodes.find((node) => node.type === "action") as
    | Node<ActionNodeData, "action">
    | undefined;

  return (
    <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end gap-4 z-30">
      <ModalRoot>
        <ModalTrigger asChild>
          <Button variant="outline" size="icon" disabled={!trigger || !action}>
            <Play className="w-4 h-4" />
          </Button>
        </ModalTrigger>
        {!!trigger && !!action && (
          <RunWorkflowModal trigger={trigger} action={action} />
        )}
      </ModalRoot>

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
