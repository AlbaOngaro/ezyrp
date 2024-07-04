import { ReactElement } from "react";
import { useForm, FormProvider, UseFormHandleSubmit } from "react-hook-form";
import { useRouter } from "next/router";

import { FunctionReturnType } from "convex/server";
import { Container } from "components/atoms/container";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { useCustomers } from "hooks/useCustomers";
import { useInvoices } from "hooks/useInvoices";
import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";
import { api } from "convex/_generated/api";
import { Breadcrumb } from "components/atoms/breadcrumb";

export function CreateInvoicePage() {
  const router = useRouter();
  const invoices = useInvoices();
  const customers = useCustomers();

  const { handleSubmit, register, control, watch, ...methods } = useForm<
    FunctionReturnType<typeof api.invoices.get>
  >({
    defaultValues: {
      description: "",
      status: "due",
      customer: customers?.data?.at(0),
      items: [],
      due: new Date().toISOString(),
      emitted: new Date().toISOString(),
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<
    FunctionReturnType<typeof api.invoices.get>
  > = () => {
    return handleSubmit(
      async (data) => {
        await invoices.create({
          ...data,
          amount: data.items.reduce(
            (acc, { price, quantity }) => acc + price * quantity,
            0,
          ),
          customer: data.customer?._id,
          items: data.items.map(({ _id }) => _id),
        });
        return router.push("/invoices");
      },
      (errors) => {
        console.error(errors);
      },
    );
  };

  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />

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
