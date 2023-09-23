import { Trigger, Root } from "@radix-ui/react-dialog";
import { ReactElement, useState } from "react";

import { Button } from "../../atoms/button/Button";
import { CreateCustomerModal } from "../../organisms/create-customer-modal/CreateCustomerModal";

import { CustomersTable } from "../../organisms/customers-table/CustomersTable";
import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";
import { Container } from "../../atoms/container/Container";
import { Heading } from "../../atoms/heading/Heading";
import { Card } from "../../atoms/card/Card";

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
