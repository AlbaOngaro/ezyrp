import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";
import { useMutation } from "lib/hooks/useMutation";
import { Doc, Id } from "convex/_generated/dataModel";
import { Table } from "components/atoms/table";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Dialog, DialogRoot, DialogTrigger } from "components/atoms/dialog";
import { Button } from "components/atoms/button";

export function EmailsTable() {
  const contextMenuItems = useGetContextMenuItems();
  const deleteEmail = useMutation(api.emails.remove);
  const { data: emails = [] } = useQuery(api.emails.list);

  return (
    <Table<Omit<Doc<"emails">, "body">>
      rows={emails}
      columns={[
        {
          id: "title",
          field: "title",
          headerName: "Title",
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
    />
  );
}
