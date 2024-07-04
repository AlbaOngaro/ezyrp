import { ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Form } from "@radix-ui/react-form";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { Table } from "components/atoms/table";
import {
  Dialog,
  DialogRoot,
  dialogs,
  DialogTrigger,
} from "components/atoms/dialog";
import { Button } from "components/atoms/button";
import { Id } from "convex/_generated/dataModel";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Input } from "components/atoms/input";
import { Badge } from "components/atoms/badge";

export function FlowsPage() {
  const router = useRouter();
  const { data: workflows = [], status } = useQuery(api.workflows.list);

  const deleteWorkflow = useMutation(api.workflows.remove);
  const creatWorkflow = useMutation(api.workflows.create);
  const updateWorkflow = useMutation(api.workflows.update);

  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Workflows" description="A list of all the workflows" />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <ModalRoot>
            <ModalTrigger asChild>
              <Button>Create new workflow</Button>
            </ModalTrigger>

            <Modal title="Create new template" description=" ">
              <Form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  try {
                    setIsCreatingWorkflow(true);
                    const _id = await creatWorkflow({
                      title: (formData.get("title") || "") as string,
                    });
                    return router.push(`/flows/${_id}/edit`);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsCreatingWorkflow(false);
                  }
                }}
              >
                <Input
                  required
                  label="Choose a name for your new workflow"
                  name="title"
                  validations={{
                    valueMissing: "Please enter a title",
                  }}
                />
                <Button
                  className="ml-auto"
                  type="submit"
                  loading={isCreatingWorkflow}
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
            contextMenuItems={[
              {
                type: "item",
                label: "View",
                onClick: (row) => router.push(`/flows/${row._id}`),
              },
              {
                type: "item",
                label: "Edit",
                onClick: (row) => router.push(`/flows/${row._id}/edit`),
              },
              {
                type: "sub",
                label: "Quick actions",
                children: [
                  {
                    type: "item",
                    label: "Toggle status",
                    onClick: (row) =>
                      updateWorkflow({
                        id: row._id,
                        status: row.status === "active" ? "inactive" : "active",
                      }),
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
                    title: "Do you really want to delete this workflow?",
                    description: "This action cannot be undone",
                    onConfirm: () => deleteWorkflow({ id: row._id }),
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
        </Card>
      </Container>
    </>
  );
}

FlowsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
