import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { Customer } from "__generated__/graphql";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { CustomerForm } from "components/organisms/customer-form/CustomerForm";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useCustomers } from "hooks/useCustomers";

export function CreateCustomerPage() {
  const router = useRouter();
  const customers = useCustomers();

  const { handleSubmit, ...methods } = useForm<Customer>({
    defaultValues: {
      email: "",
      name: "",
      photoUrl: "",
      address: "",
      city: "",
      code: "",
      country: "",
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Customer> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await customers.create({
        variables: {
          createCustomerArgs: [data],
        },
      });

      onSuccess(data);

      return router.push("/customers");
    }, onError);

  return (
    <Container as="section" className="py-10">
      <Heading title="Create new customer" />

      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <CustomerForm />
      </FormProvider>
    </Container>
  );
}

CreateCustomerPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
