import { useMutation } from "convex/react";
import { Pencil, ToggleLeft, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useWorkflowId } from "components/organisms/flow-editor/hooks/useWorkflowId";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { dialogs } from "components/atoms/dialog";

export function useGetMenuItems() {
  const id = useWorkflowId();
  const router = useRouter();
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
        dialogs.warning({
          title: "Are you sure you want to delete this workflow?",
          description: "This action cannot be undone.",
          onConfirm: async () => {
            deleteWorkflow({ id });
            return router.push("/flows");
          },
        }),
      icon: <Trash className="w-4 h-4" />,
    },
  ];
}
