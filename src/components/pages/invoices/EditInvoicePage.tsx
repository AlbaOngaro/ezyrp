import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";

import { Heading } from "components/atoms/heading/Heading";
import { Container } from "components/atoms/container/Container";

import { Doc, Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type Invoice = Doc<"invoices">;

type Props = {
  id: Id<"invoices">;
};

export function EditInvoicePage({ id }: Props) {
  const [getInvoice] = useLazyQuery(api.invoices.get);

  const { handleSubmit, reset, ...methods } = useForm({
    defaultValues: async () => {
      const invoice = await getInvoice({
        id,
      });

      if (!invoice) {
        return undefined;
      }

      return invoice;
    },
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
      id: (Array.isArray(query.id) ? query.id[0] : query.id) as Id<"invoices">,
    },
  };
}
