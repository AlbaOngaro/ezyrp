import { ReactElement } from "react";
import { useForm, FormProvider, UseFormHandleSubmit } from "react-hook-form";
import { useRouter } from "next/router";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { useCustomers } from "hooks/useCustomers";
import { useInvoices } from "hooks/useInvoices";
import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";
import { api } from "convex/_generated/api";

type CreateInvoiceFn = typeof api.invoices.create;

export function CreateInvoicePage() {
  const router = useRouter();
  const invoices = useInvoices();
  const customers = useCustomers();

  const { handleSubmit, register, control, watch, ...methods } = useForm<
    CreateInvoiceFn["_args"]
  >({
    defaultValues: {
      description: "",
      status: "pending",
      customer: customers?.data?.at(0)?._id,
      items: [],
      due: new Date().toISOString(),
      emitted: new Date().toISOString(),
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<any> = () =>
    handleSubmit(
      async (data) => {
        await invoices.create(data);
        return router.push("/invoices");
      },
      (errors) => {
        console.error(errors);
      },
    );

  return (
    <Container as="section" className="py-10">
      <Heading title="Create new invoice" description=" " />

      <FormProvider
        {...methods}
        handleSubmit={handleSubmitWrapper}
        register={register}
        control={control}
        watch={watch}
      >
        <InvoiceForm />
      </FormProvider>
    </Container>
  );
}

CreateInvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
