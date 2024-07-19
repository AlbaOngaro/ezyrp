import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { StatusFilter } from "./components/status-filter";
import { useMutation } from "lib/hooks/useMutation";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { Badge } from "components/atoms/badge";
import { Dialog, DialogRoot, DialogTrigger } from "components/atoms/dialog";
import { Button } from "components/atoms/button";
import { Id } from "convex/_generated/dataModel";

const PAGE_SIZE = 5;

export function WorkflowsTable() {
  const [workflowStatus, setWorkflowStatus] = useState<
    "active" | "inactive" | undefined
  >(undefined);
  const contextMenuItems = useGetContextMenuItems();
  const deleteWorkflow = useMutation(api.workflows.remove);

  const {
    results: workflows = [],
    status,
    isLoading,
    loadMore,
  } = usePaginatedQuery(
    api.workflows.search,
    {
      status: workflowStatus,
    },
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  return (
    <Table
      loading={isLoading}
      rows={workflows || []}
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
          filterable: true,
          filterComponent: (
            <StatusFilter
              status={workflowStatus}
              setStatus={setWorkflowStatus}
            />
          ),
          render: (invoice) => <Badge>{invoice.status}</Badge>,
        },
      ]}
      contextMenuItems={contextMenuItems}
      withMultiSelect
      renderSelectedActions={(rows) => (
        <DialogRoot>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              data-testid="workflows-table__delete-all-btn"
            >
              Delete all
            </Button>
          </DialogTrigger>

          <Dialog
            data-testid="workflows__delete-dialog"
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
            cancelButtonProps={{
              // @ts-ignore
              "data-testid": "workflows__delete-dialog__cancel-btn",
            }}
            confirmButtonProps={{
              // @ts-ignore
              "data-testid": "workflows__delete-dialog__confirm-btn",
            }}
          />
        </DialogRoot>
      )}
      pagination={{
        status,
        pageSize: PAGE_SIZE,
        loadMore: () => loadMore(PAGE_SIZE),
      }}
    />
  );
}
