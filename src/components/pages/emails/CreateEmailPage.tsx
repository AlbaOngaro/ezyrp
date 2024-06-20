import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Breadcrumb } from "components/atoms/breadcrumb";
import { EmailEditor } from "components/organisms/email-editor";
import { Button } from "components/atoms/button";

export function CreateEmailPage() {
  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Breadcrumb />

        <div className="ml-auto">
          <Button>Save</Button>
        </div>
      </Container>

      <Container as="section">
        <EmailEditor />
      </Container>
    </>
  );
}

CreateEmailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
