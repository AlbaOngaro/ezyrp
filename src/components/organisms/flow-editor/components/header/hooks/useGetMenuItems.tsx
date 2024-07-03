import { useMutation } from "convex/react";
import { Pencil, ToggleLeft, Trash } from "lucide-react";
import { useWorkflowId } from "components/organisms/flow-editor/hooks/useWorkflowId";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";

export function useGetMenuItems() {
  const id = useWorkflowId();
  const deleteWorkflow = useMutation(api.workflows.remove);
  const updateWorkflow = useMutation(api.workflows.update);
  const { data: workflow } = useQuery(api.workflows.get, { id });

  return [
    {
      id: "status",
      label: workflow?.status === "inactive" ? "Enable" : "Disable",
      icon: <ToggleLeft className="w-4 h-4" />,
      onClick: () =>
        updateWorkflow({
          id,
          status: workflow?.status == "inactive" ? "active" : "inactive",
        }),
    },
    {
      id: "rename",
      label: "Rename",
      icon: <Pencil className="w-4 h-4" />,
      onClick: () =>
        updateWorkflow({
          id,
          title: "A new title",
        }),
    },
    {
      id: "delete",
      label: "Delete",
      className: "text-red-500 focus:text-red-500",
      onClick: () =>
        deleteWorkflow({
          id,
        }),
      icon: <Trash className="w-4 h-4" />,
    },
  ];
}
