import { ReactElement } from "react";

import { useRouter } from "next/router";

import { CustomersTable } from "../../organisms/customers-table/CustomersTable";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";

export function CustomersPage() {
  const router = useRouter();

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Customers"
          description="A list of all the customers in your account including their name, email, and phone number."
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button size="lg" onClick={() => router.push("/customers/create")}>
            Add customer
          </Button>
        </div>
      </Container>

      <Container as="section">
        <Card>
          <CustomersTable />
        </Card>
      </Container>
    </>
  );
}

CustomersPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
