import { Node } from "reactflow";
import { ActionNodeData, TriggerNodeData } from "../../types";
import { Modal } from "components/atoms/modal";

type Props = {
  trigger: Node<TriggerNodeData, "trigger">;
  action: Node<ActionNodeData, "action">;
};

export function RunWorkflowModal({ trigger, action }: Props) {
  console.log(trigger, action);

  return (
    <Modal title="Run workflow">
      <div className="grid grid-cols-2">
        <div>{trigger.data.label}</div>
        <div>{action.data.label}</div>
      </div>
    </Modal>
  );
}
