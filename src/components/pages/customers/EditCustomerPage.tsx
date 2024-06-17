import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { CustomerForm } from "components/organisms/customer-form/CustomerForm";

import { useCustomers } from "hooks/useCustomers";
import { useFileUpload } from "hooks/useFileUpload";
import { Doc, Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type Customer = Doc<"customers">;

type Props = {
  id: Id<"customers">;
};

export function EditCustomerPage({ id }: Props) {
  const router = useRouter();
  const customers = useCustomers();
  const [getCustomer] = useLazyQuery(api.customers.get);
  const handleFileUpload = useFileUpload();

  const { handleSubmit, ...methods } = useForm<Customer>({
    defaultValues: async () => {
      const customer = await getCustomer({ id });

      return customer as Customer;
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
            id: data._id,
            ...data,
            photoUrl,
          });

          onSuccess(data);

          return router.push("/customers");
        } catch (error: unknown) {
          throw new Error("Failed to upload image!");
        }
      }

      await customers.update({
        id: data._id,
        ...data,
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
  const id = (
    Array.isArray(query.id) ? query.id[0] : query.id
  ) as Id<"customers">;

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
