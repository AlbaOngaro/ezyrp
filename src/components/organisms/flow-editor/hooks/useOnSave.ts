import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { useReactFlow, Node } from "reactflow";

import { isActionNode, isEmailActionNode, isTriggerNode } from "../types";
import { useWorkflowId } from "./useWorkflowId";
import { api } from "convex/_generated/api";

import { Settings } from "convex/workflows";

type SaveFn = () => Promise<void>;
type SaveState = {
  loading: boolean;
};

function getSettings(nodes: Node[]): Settings | undefined {
  const trigger = nodes.find((node) => isTriggerNode(node));
  const action = nodes.find((node) => isActionNode(node));

  if (!trigger || !action) {
    return undefined;
  }

  if (isEmailActionNode(action)) {
    return {
      event: trigger.data.event,
      action: action.data.action,
      template: action.data.template,
    };
  }

  return undefined;
}

export function useOnSave(): [SaveFn, SaveState] {
  const id = useWorkflowId();
  const { toObject } = useReactFlow();

  const updateWorfklow = useMutation(api.workflows.update);

  const [loading, setLoading] = useState(false);

  const onSave = useCallback(async () => {
    try {
      setLoading(true);
      const flow = toObject();

      await updateWorfklow({
        id,
        nodes: flow.nodes.map(({ selected: _selected, ...node }) => node),
        edges: flow.edges.map(({ selected: _selected, ...edge }) => edge),
        settings: getSettings(flow.nodes),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, updateWorfklow, toObject]);

  return [onSave, { loading }];
}
