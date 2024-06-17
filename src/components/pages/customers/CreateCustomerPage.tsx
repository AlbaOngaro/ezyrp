import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { Customer, InputCreateCustomerArgs } from "__generated__/graphql";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { CustomerForm } from "components/organisms/customer-form/CustomerForm";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useCustomers } from "hooks/useCustomers";
import { useFileUpload } from "hooks/useFileUpload";

export function CreateCustomerPage() {
  const router = useRouter();
  const customers = useCustomers();
  const handleFileUpload = useFileUpload();

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
    handleSubmit(async ({ __typename, ...data }) => {
      if (data.photoUrl && !data.photoUrl.startsWith("https")) {
        const file = await fetch(data.photoUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], data.name, {
                type: blob.type,
                lastModified: new Date().getTime(),
              }),
          );

        try {
          const photoUrl = await handleFileUpload(file);

          await customers.create({
            variables: {
              createCustomerArgs: [
                {
                  ...data,
                  photoUrl,
                } as InputCreateCustomerArgs,
              ],
            },
          });

          onSuccess(data);

          return router.push("/customers");
        } catch (error: unknown) {
          throw new Error("Failed to upload image!");
        }
      }

      await customers.create({
        variables: {
          createCustomerArgs: [data as InputCreateCustomerArgs],
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
