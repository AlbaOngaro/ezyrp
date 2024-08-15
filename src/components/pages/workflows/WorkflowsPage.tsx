import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Form } from "@radix-ui/react-form";
import { useMutation } from "lib/hooks/useMutation";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Input } from "components/atoms/input";
import { WorkflowsTable } from "components/organisms/workflows-table";
import { useProPlanDialog } from "hooks/useProPlanDialog";

export function WorkflowsPage() {
  useProPlanDialog();
  const router = useRouter();
  const [creatWorkflow, { loading }] = useMutation(api.workflows.create);

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
                    const _id = await creatWorkflow({
                      title: (formData.get("title") || "") as string,
                    });
                    return router.push(`/workflows/${_id}/edit`);
                  } catch (error) {
                    console.error(error);
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
                <Button className="ml-auto" type="submit" loading={loading}>
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
