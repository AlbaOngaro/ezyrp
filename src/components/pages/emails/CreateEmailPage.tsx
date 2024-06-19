import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Breadcrumb } from "components/atoms/breadcrumb";
import { EmailEditor } from "components/organisms/email-editor";

export function CreateEmailPage() {
  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />
      <EmailEditor />
    </Container>
  );
}

CreateEmailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
