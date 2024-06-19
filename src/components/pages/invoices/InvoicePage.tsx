import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";
import { Breadcrumb } from "components/atoms/breadcrumb";

type Props = {
  id: Id<"invoices">;
};

export function InvoicePage({ id }: Props) {
  const [loadInvoice] = useLazyQuery(api.invoices.get);

  const methods = useForm({
    defaultValues: async () => loadInvoice({ id }),
  });

  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />

      <FormProvider {...methods}>
        <InvoiceForm disabled />
      </FormProvider>
    </Container>
  );
}

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
      id: id as Id<"invoices">,
    },
  };
}

InvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
