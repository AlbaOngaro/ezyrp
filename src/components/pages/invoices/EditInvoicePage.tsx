import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { FunctionReturnType } from "convex/server";
import { useRouter } from "next/router";
import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";

import { Heading } from "components/atoms/heading";

import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";
import { useInvoices } from "hooks/useInvoices";

type Props = {
  id: Id<"invoices">;
};

export function EditInvoicePage({ id }: Props) {
  const router = useRouter();
  const invoices = useInvoices();
  const [getInvoice] = useLazyQuery(api.invoices.get);

  const { handleSubmit, reset, ...methods } = useForm<
    FunctionReturnType<typeof api.invoices.get>
  >({
    defaultValues: async () => {
      const invoice = await getInvoice({
        id,
      });

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      return invoice;
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<
    FunctionReturnType<typeof api.invoices.get>
  > = () => {
    return handleSubmit(
      async ({ _id, _creationTime, customer, items, ...data }) => {
        await invoices.update({
          ...data,
          id: _id,
          items: items.map(({ _id }) => _id),
          customer: customer._id,
          amount: items.reduce(
            (acc, { price, quantity }) => acc + price * quantity,
            0,
          ),
        });

        return router.push("/invoices");
      },
      console.error,
    );
  };

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
