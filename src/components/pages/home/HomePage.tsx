import { Trigger, Root } from "@radix-ui/react-dialog";
import { ReactElement, useState } from "react";

import { Button } from "components/atoms/button/Button";
import { CreateCustomerModal } from "components/organisms/create-customer-modal/CreateCustomerModal";

import { CustomersTable } from "components/organisms/customers-table/CustomersTable";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

export function HomePage() {
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  return (
    <>
      <div className="px-12 py-8 sm:flex sm:items-center ">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Customers
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the customers in your account including their name,
            email, and phone number.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Root open={isCreatingCustomer} onOpenChange={setIsCreatingCustomer}>
            <Trigger asChild>
              <Button size="md">Add customer</Button>
            </Trigger>

            <CreateCustomerModal setIsOpen={setIsCreatingCustomer} />
          </Root>
        </div>
      </div>

      <CustomersTable />
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
