import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Breadcrumb } from "components/atoms/breadcrumb";

export function CreateEmailPage() {
  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />
    </Container>
  );
}

CreateEmailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
