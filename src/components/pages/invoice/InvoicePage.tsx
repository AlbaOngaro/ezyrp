import { ReactElement } from "react";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useInvoice } from "hooks/useInvoice";

export function InvoicePage() {
  const { data } = useInvoice();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title={`Invoice ${data?.invoice?.id || ""}`}
          description="This is an invoice page"
        />
      </Container>
      <Container as="section"></Container>
    </>
  );
}

InvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout isSidebarOpen={false}>{page}</SidebarLayout>;
};
