import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "convex/react";

import { Form } from "@radix-ui/react-form";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { useQuery } from "lib/hooks/useQuery";
import { Doc, Id } from "convex/_generated/dataModel";
import { useDownloadEmailHtml } from "components/organisms/email-editor/hooks/useDownloadEmailHtml";
import {
  Dialog,
  DialogRoot,
  dialogs,
  DialogTrigger,
} from "components/atoms/dialog";
import { Modal, ModalRoot, modals, ModalTrigger } from "components/atoms/modal";
import { Input } from "components/atoms/input";

export function EmailsPage() {
  const router = useRouter();
  const createEmail = useMutation(api.emails.create);
  const deleteEmail = useMutation(api.emails.remove);
  const updateEmail = useMutation(api.emails.update);
  const [downloadEmailHhtml] = useDownloadEmailHtml();
  const { data: emails = [] } = useQuery(api.emails.list);

  const [isCreatingEmail, setIsCreatingEmail] = useState(false);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Emails"
          description="A list of all the email templates"
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <ModalRoot>
            <ModalTrigger asChild>
              <Button>Create new template</Button>
            </ModalTrigger>

            <Modal title="Create new template" description=" ">
              <Form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  try {
                    setIsCreatingEmail(true);
                    const _id = await createEmail({
                      title: (formData.get("title") || "") as string,
                    });
                    return router.push(`/emails/${_id}/edit`);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsCreatingEmail(false);
                  }
                }}
              >
                <Input
                  required
                  label="Choose a name for your new template"
                  name="title"
                  validations={{
                    valueMissing: "Please enter a title",
                  }}
                />
                <Button
                  className="ml-auto"
                  type="submit"
                  loading={isCreatingEmail}
                >
                  Create
                </Button>
              </Form>
            </Modal>
          </ModalRoot>
        </div>
      </Container>
      <Container as="section">
        <Card>
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
            ]}
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
                      rows.map((row) =>
                        deleteEmail({ id: row._id as Id<"emails"> }),
                      ),
                    )
                  }
                />
              </DialogRoot>
            )}
          />
        </Card>
      </Container>
    </>
  );
}

EmailsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
