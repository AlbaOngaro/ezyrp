import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice } from "__generated__/graphql";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";

import { Heading } from "components/atoms/heading/Heading";
import { Container } from "components/atoms/container/Container";

import { INVOICE } from "lib/queries/INVOICE";
import { schema } from "components/organisms/invoice-form/schema";

type Props = {
  id: string;
};

export function EditInvoicePage({ id }: Props) {
  const [getInvoice] = useLazyQuery(INVOICE, {
    variables: {
      id,
    },
  });

  const { handleSubmit, reset, ...methods } = useForm({
    defaultValues: async () => {
      const { data } = await getInvoice();
      return data?.invoice;
    },
    // @ts-ignore
    resolver: zodResolver(schema),
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Invoice> = () =>
    handleSubmit(console.debug, console.error);

  return (
    <Container as="section" className="py-10">
      <Heading title="Editing invoice" description=" " />

      <FormProvider
        {...methods}
        reset={reset}
        handleSubmit={handleSubmitWrapper}
      >
        <InvoiceForm />
      </FormProvider>
    </Container>
  );
}

EditInvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  if (!query.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: Array.isArray(query.id) ? query.id[0] : query.id,
    },
  };
}
