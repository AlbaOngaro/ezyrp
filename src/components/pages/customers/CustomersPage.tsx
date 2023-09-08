import { Trigger, Root } from "@radix-ui/react-dialog";
import { ReactElement, useState } from "react";

import { Button } from "components/atoms/button/Button";
import { CreateCustomerModal } from "components/organisms/create-customer-modal/CreateCustomerModal";

import { CustomersTable } from "components/organisms/customers-table/CustomersTable";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Card } from "components/atoms/card/Card";

export function CustomersPage() {
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          title="Customers"
          description="A list of all the customers in your account including their name, email, and phone number."
        />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Root open={isCreatingCustomer} onOpenChange={setIsCreatingCustomer}>
            <Trigger asChild>
              <Button size="lg">Add customer</Button>
            </Trigger>

            <CreateCustomerModal setIsOpen={setIsCreatingCustomer} />
          </Root>
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
