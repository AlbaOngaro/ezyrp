import { useCallback, useContext, useState } from "react";

import { WorkflowContext } from "../context";
import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";

type SaveFn = () => Promise<void>;
type SaveState = {
  loading: boolean;
  error: Error | null;
};

export function useOnSave(): [SaveFn, SaveState] {
  const {
    setEdges: _setEdges,
    setNodes: _setNodes,
    workspace: _workspace,
    _creationTime,
    _id: id,
    hasChanges: _hasChanges,
    ...workflow
  } = useContext(WorkflowContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updateWorfklow] = useMutation(api.workflows.update);

  const onSave = useCallback(async () => {
    try {
      setLoading(true);

      await updateWorfklow({
        id,
        ...workflow,
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [id, updateWorfklow, workflow]);

  return [onSave, { loading, error }];
}
