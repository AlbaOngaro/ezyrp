import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { EmailEditor } from "components/organisms/email-editor";

export function CreateEmailPage() {
  return (
    <Container as="section" className="h-[calc(100vh-3.5rem)] overflow-scroll">
      <EmailEditor />
    </Container>
  );
}

CreateEmailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
