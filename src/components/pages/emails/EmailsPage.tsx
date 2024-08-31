import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Form } from "@radix-ui/react-form";
import { useMutation } from "lib/hooks/useMutation";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Input } from "components/atoms/input";
import { EmailsTable } from "components/organisms/emails-table";
import { useProPlanDialog } from "hooks/useProPlanDialog";

export function EmailsPage() {
  useProPlanDialog();
  const router = useRouter();
  const [createEmail, { loading }] = useMutation(api.emails.create);

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
                    const _id = await createEmail({
                      title: (formData.get("title") || "") as string,
                    });
                    return router.push(`/emails/${_id}/edit`);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Input
                  required
                  label="Choose a name for your new template"
                  description="This will be the subject of the email when sending this template."
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
          <EmailsTable />
        </Card>
      </Container>
    </>
  );
}

EmailsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
