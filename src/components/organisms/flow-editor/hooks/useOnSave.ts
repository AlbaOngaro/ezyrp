import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { useReactFlow } from "reactflow";

import { useWorkflowId } from "./useWorkflowId";
import { api } from "convex/_generated/api";

type SaveFn = () => Promise<void>;
type SaveState = {
  loading: boolean;
};

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
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, updateWorfklow, toObject]);

  return [onSave, { loading }];
}
