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
import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type UpdateCustomerFn = typeof api.customers.update;

type Props = {
  id: Id<"customers">;
};

export function EditCustomerPage({ id }: Props) {
  const router = useRouter();
  const customers = useCustomers();
  const [getCustomer] = useLazyQuery(api.customers.get);
  const handleFileUpload = useFileUpload();

  const { handleSubmit, ...methods } = useForm<UpdateCustomerFn["_args"]>({
    defaultValues: async () => {
      const customer = await getCustomer({
        id,
      });

      if (!customer) {
        throw new Error("Customer not found!");
      }

      const { _id, _creationTime, ...rest } = customer;

      return {
        id: _id,
        ...rest,
      };
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<UpdateCustomerFn["_args"]> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      if (data.photoUrl && data.name) {
        const file = await fetch(data.photoUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], data.name as string, {
                type: blob.type,
                lastModified: new Date().getTime(),
              }),
          );

        try {
          const photoUrl = await handleFileUpload(file);

          await customers.update({
            ...data,
            photoUrl,
          });

          onSuccess(data);

          return router.push("/customers");
        } catch (error: unknown) {
          throw new Error("Failed to upload image!");
        }
      }

      await customers.update(data);

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
