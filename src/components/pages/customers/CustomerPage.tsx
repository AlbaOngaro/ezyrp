import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormProvider, useForm } from "react-hook-form";

import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { CustomerForm } from "components/organisms/customer-form/CustomerForm";

import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";
import { Breadcrumb } from "components/atoms/breadcrumb";

type Props = {
  id: Id<"customers">;
};

export function CustomerPage({ id }: Props) {
  const [getCustomer] = useLazyQuery(api.customers.get);

  const methods = useForm({
    defaultValues: async () =>
      getCustomer({
        id,
      }),
  });

  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />

      <FormProvider {...methods}>
        <CustomerForm disabled />
      </FormProvider>
    </Container>
  );
}

CustomerPage.getLayout = function getLayout(page: ReactElement) {
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
