import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";

export function FlowsPage() {
  return (
    <Container as="section" className="py-10 sm:flex sm:items-center">
      <Heading title="Workflows" description="A list of all the workflows" />
    </Container>
  );
}

FlowsPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
