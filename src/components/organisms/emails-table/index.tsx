import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { usePaginatedQuery } from "lib/hooks/usePaginatedQuery";
import { useMutation } from "lib/hooks/useMutation";
import { Doc, Id } from "convex/_generated/dataModel";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { Dialog, DialogRoot, DialogTrigger } from "components/atoms/dialog";
import { Button } from "components/atoms/button";
import { useGetUserPlan } from "lib/hooks/useGetUserPlan";

const PAGE_SIZE = 5;

export function EmailsTable() {
  const plan = useGetUserPlan();
  const contextMenuItems = useGetContextMenuItems();
  const [deleteEmail] = useMutation(api.emails.remove);
  const {
    results: emails = [],
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.emails.search,
    !plan || plan !== "pro" ? "skip" : {},
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  return (
    <Table<Omit<Doc<"emails">, "body">>
      loading={isLoading}
      rows={emails}
      columns={[
        {
          id: "title",
          field: "title",
          headerName: "Title",
        },
      ]}
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
            title="Do you really want to delete all the selected email templates?"
            description="This action cannot be undone."
            onConfirm={() =>
              Promise.all(
                rows.map((row) => deleteEmail({ id: row._id as Id<"emails"> })),
              )
            }
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
