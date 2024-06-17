import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useLazyQuery } from "@apollo/client";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { Customer } from "__generated__/graphql";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { CustomerForm } from "components/organisms/customer-form/CustomerForm";

import { CUSTOMER } from "lib/queries/CUSTOMER";

import { useCustomers } from "hooks/useCustomers";
import { useFileUpload } from "hooks/useFileUpload";

type Props = {
  id: string;
};

export function EditCustomerPage({ id }: Props) {
  const router = useRouter();
  const customers = useCustomers();
  const [getCustomer] = useLazyQuery(CUSTOMER);
  const handleFileUpload = useFileUpload();

  const { handleSubmit, ...methods } = useForm<Customer>({
    defaultValues: async () => {
      const { data } = await getCustomer({
        variables: {
          id,
        },
      });

      return data?.customer as Customer;
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Customer> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      if (data.photoUrl) {
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

          await customers.update({
            variables: {
              updateCustomerArgs: [
                {
                  ...data,
                  photoUrl,
                },
              ],
            },
          });

          onSuccess(data);

          return router.push("/customers");
        } catch (error: unknown) {
          throw new Error("Failed to upload image!");
        }
      }

      await customers.update({
        variables: {
          updateCustomerArgs: [data],
        },
      });

      onSuccess(data);

      return router.push("/customers");
    }, onError);

  return (
    <Container>
      <Heading title="Edit customer" />
      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <CustomerForm />
      </FormProvider>
    </Container>
  );
}

EditCustomerPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
}
