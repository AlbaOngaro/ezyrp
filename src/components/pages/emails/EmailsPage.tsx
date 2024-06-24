import { ReactElement, useState } from "react";
import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { useQuery } from "lib/hooks/useQuery";
import { Doc } from "convex/_generated/dataModel";
import { useDownloadEmailHtml } from "components/organisms/email-editor/hooks/useDownloadEmailHtml";
import { Dialog } from "components/atoms/dialog";

type Email = FunctionReturnType<typeof api.emails.get>;

export function EmailsPage() {
  const router = useRouter();
  const createEmail = useMutation(api.emails.create);
  const deleteEmail = useMutation(api.emails.remove);
  const [downloadEmailHhtml] = useDownloadEmailHtml();
  const { data: emails = [] } = useQuery(api.emails.list);
  const [isCreatingEmail, setIsCreatingEmail] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState<Email | null>(null);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Emails"
          description="A list of all the email templates"
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            loading={isCreatingEmail}
            onClick={async () => {
              try {
                setIsCreatingEmail(true);
                const _id = await createEmail();
                return router.push(`/emails/${_id}/edit`);
              } catch (error) {
                console.error(error);
              } finally {
                setIsCreatingEmail(false);
              }
            }}
          >
            Add email template
          </Button>
        </div>
      </Container>
      <Container as="section">
        <Card>
          <Table<Omit<Doc<"emails">, "body">>
            rows={emails}
            columns={[
              {
                id: "id",
                field: "_id",
                headerName: "ID",
              },
              {
                id: "title",
                field: "title",
                headerName: "Title",
              },
            ]}
            withContextMenu
            contextMenuItems={[
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
                type: "item",
                label: "Download",
                onClick: (row) => downloadEmailHhtml(row._id),
              },
              {
                type: "separator",
              },
              {
                type: "item",
                label: "Delete",
                onClick: (row) => {
                  setEmail(row as Email);
                  setIsDialogOpen(true);
                },
              },
            ]}
          />
        </Card>
      </Container>

      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog
          title="Do you really want to delete this email template?"
          description="This action cannot be undone"
          onConfirm={() => {
            if (email) {
              return deleteEmail({
                id: email._id,
              });
            }
          }}
        />
      </DialogRoot>
    </>
  );
}

EmailsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
