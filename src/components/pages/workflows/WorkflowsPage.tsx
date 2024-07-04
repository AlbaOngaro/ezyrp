import { ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Form } from "@radix-ui/react-form";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Input } from "components/atoms/input";
import { WorkflowsTable } from "components/organisms/workflows-table";

export function WorkflowsPage() {
  const router = useRouter();
  const creatWorkflow = useMutation(api.workflows.create);

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
                    return router.push(`/workflows/${_id}/edit`);
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
          <WorkflowsTable />
        </Card>
      </Container>
    </>
  );
}

WorkflowsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
