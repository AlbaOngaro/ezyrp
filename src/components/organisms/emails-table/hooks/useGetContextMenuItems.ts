import { useRouter } from "next/router";
import { useMutation } from "convex/react";
import { TableContextMenuItem } from "components/atoms/table/types";
import { Doc } from "convex/_generated/dataModel";
import { modals } from "components/atoms/modal";
import { dialogs } from "components/atoms/dialog";
import { api } from "convex/_generated/api";
import { useDownloadEmailHtml } from "components/organisms/email-editor/hooks/useDownloadEmailHtml";

export function useGetContextMenuItems(): TableContextMenuItem<
  Omit<Doc<"emails">, "body">
>[] {
  const router = useRouter();
  const updateEmail = useMutation(api.emails.update);
  const deleteEmail = useMutation(api.emails.remove);
  const [downloadEmailHhtml] = useDownloadEmailHtml();

  return [
    {
      type: "item",
      label: "View",
      onClick: (row) => router.push(`/emails/${row._id}`),
    },
    {
      type: "item",
      label: "Edit",
      onClick: (row) => router.push(`/emails/${row._id}/edit`),
    },
    {
      type: "sub",
      label: "Quick actions",
      children: [
        {
          type: "item",
          label: "Rename",
          onClick: (row) =>
            modals.input({
              title: "Rename email template",
              inputProps: {
                name: "title",
                label: "Template title",
                description:
                  "This will be the subject of the email when sending this template.",
                defaultValue: row.title,
              },
              onSubmit: async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title");
                if (title && typeof title === "string") {
                  await updateEmail({
                    id: row._id,
                    title,
                  });
                }
              },
            }),
        },
        {
          type: "item",
          label: "Download",
          onClick: (row) => downloadEmailHhtml(row._id),
        },
      ],
    },
    {
      type: "separator",
    },
    {
      type: "item",
      label: "Delete",
      onClick: (row) =>
        dialogs.warning({
          title: "Do you really want to delete this email template?",
          description: "This action cannot be undone.",
          onConfirm: () => deleteEmail({ id: row._id }),
        }),
    },
  ];
}
