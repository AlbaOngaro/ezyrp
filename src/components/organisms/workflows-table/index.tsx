import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { useMutation } from "lib/hooks/useMutation";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { Badge } from "components/atoms/badge";
import { Dialog, DialogRoot, DialogTrigger } from "components/atoms/dialog";
import { Button } from "components/atoms/button";
import { Id } from "convex/_generated/dataModel";

export function WorkflowsTable() {
  const contextMenuItems = useGetContextMenuItems();
  const deleteWorkflow = useMutation(api.workflows.remove);

  const { data: workflows = [], status } = useQuery(api.workflows.list);

  return (
    <Table
      loading={status === "pending"}
      rows={workflows}
      columns={[
        {
          id: "title",
          field: "title",
          headerName: "Title",
        },
        {
          id: "status",
          field: "status",
          headerName: "Status",
          sortable: true,
          render: (invoice) => <Badge>{invoice.status}</Badge>,
        },
      ]}
      withContextMenu
      contextMenuItems={contextMenuItems}
      withMultiSelect
      renderSelectedActions={(rows) => (
        <DialogRoot>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete all
            </Button>
          </DialogTrigger>

          <Dialog
            overlayClassname="!ml-0"
            title="Do you really want to delete all the selected workflows?"
            description="This action cannot be undone."
            onConfirm={() =>
              Promise.all(
                rows.map((row) =>
                  deleteWorkflow({ id: row._id as Id<"workflows"> }),
                ),
              )
            }
          />
        </DialogRoot>
      )}
    />
  );
}
