import { ReactElement } from "react";
import { useForm, FormProvider, UseFormHandleSubmit } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { useCustomers } from "hooks/useCustomers";
import { useInvoices } from "hooks/useInvoices";
import { useItems } from "hooks/useItems";
import { Item } from "__generated__/graphql";
import { InvoiceForm } from "components/organisms/invoice-form/InvoiceForm";
import {
  InvoiceFormValue,
  schema,
} from "components/organisms/invoice-form/schema";

export function isSavedItem(id: string): boolean {
  return /item\:.{20}/.test(id);
}

export function CreateInvoicePage() {
  const items = useItems();
  const router = useRouter();
  const invoices = useInvoices();
  const customers = useCustomers();

  const { handleSubmit, register, control, watch, ...methods } =
    useForm<InvoiceFormValue>({
      defaultValues: {
        description: "",
        status: "pending",
        // @ts-ignore
        customer: customers?.data?.customers?.results?.at(0),
        items: [],
        due: new Date().toISOString(),
        emitted: new Date().toISOString(),
      },
      // @ts-ignore
      resolver: zodResolver(schema),
    });

  const handleSubmitWrapper: UseFormHandleSubmit<InvoiceFormValue> = () =>
    handleSubmit(
      async (data) => {
        const createItemsInput = data.items
          .filter((item) => !isSavedItem(item.id))
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ id, ...item }) => ({
            ...item,
            onetime: true,
          }));

        if (createItemsInput.length) {
          const newItems = await items.create({
            variables: {
              createItemsInput,
            },
          });

          const itemsToBeAdded = [
            ...data.items.filter((item) => isSavedItem(item.id)),
            ...(newItems?.data?.createItems || []),
          ] as Item[];

          await invoices.create({
            variables: {
              createInvoicesArgs: [
                {
                  customer: data.customer.id,
                  description: data.description,
                  status: "pending",
                  due: data.due,
                  emitted: data.emitted,
                  items: Array.from(
                    {
                      length: itemsToBeAdded.length,
                    },
                    (_, i) => i,
                  ).flatMap((i) =>
                    Array.from(
                      { length: itemsToBeAdded[i].quantity },
                      () => itemsToBeAdded[i].id,
                    ),
                  ),
                },
              ],
            },
          });

          return router.push("/invoices");
        }

        await invoices.create({
          variables: {
            createInvoicesArgs: [
              {
                customer: data.customer.id,
                description: data.description,
                status: "pending",
                due: data.due,
                emitted: data.emitted,
                items: Array.from(
                  {
                    length: data.items.length,
                  },
                  (_, i) => i,
                ).flatMap((i) =>
                  Array.from(
                    { length: data.items[i].quantity },
                    () => data.items[i].id,
                  ),
                ),
              },
            ],
          },
        });

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
