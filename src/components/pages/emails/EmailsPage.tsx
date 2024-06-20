import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "convex/react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { useQuery } from "lib/hooks/useQuery";

export function EmailsPage() {
  const router = useRouter();
  const [isCreatingEmail, setIsCreatingEmail] = useState(false);
  const createEmail = useMutation(api.emails.create);
  const { data: emails = [] } = useQuery(api.emails.list);

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
          <Table
            rows={emails}
            columns={[
              {
                id: "id",
                field: "_id",
                headerName: "ID",
              },
            ]}
          />
        </Card>
      </Container>
    </>
  );
}

EmailsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
