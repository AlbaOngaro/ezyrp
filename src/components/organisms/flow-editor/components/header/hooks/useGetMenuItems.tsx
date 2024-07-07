import { Pencil, ToggleLeft, ToggleRight, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useMutation } from "lib/hooks/useMutation";
import { useWorkflowId } from "components/organisms/flow-editor/hooks/useWorkflowId";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { dialogs } from "components/atoms/dialog";
import { modals } from "components/atoms/modal";

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
      icon:
        workflow?.status == "inactive" ? (
          <ToggleLeft className="w-4 h-4" />
        ) : (
          <ToggleRight className="w-4 h-4" />
        ),
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
        modals.input({
          title: "Rename workflow",
          onSubmit: async (e) => {
            const formData = new FormData(e.currentTarget);
            const title = formData.get("title");
            if (title && typeof title === "string") {
              await updateWorkflow({ id, title });
            }
          },
          inputProps: {
            name: "title",
            label: "Workflow name",
            defaultValue: workflow?.title,
          },
          submitButtonProps: {
            children: "Confirm",
          },
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
