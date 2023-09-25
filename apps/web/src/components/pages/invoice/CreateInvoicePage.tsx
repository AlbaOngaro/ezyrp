import { Root as Form } from "@radix-ui/react-form";
import { ReactElement } from "react";
import { format } from "date-fns";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Input } from "components/atoms/input/Input";
import { Select } from "components/atoms/select/Select";
import { TextArea } from "components/atoms/textarea/TextArea";

import { InvoiceItemsTable } from "components/organisms/invoice-items-table/InvoiceItemsTable";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { useCustomers } from "hooks/useCustomers";
import { invoice } from "server/schema/invoice";
import { customer } from "server/schema/customer";
import { item } from "server/schema/inventory";
import { useInvoices } from "hooks/useInvoices";
import { useItems } from "hooks/useItems";
import { Item } from "__generated__/graphql";

export function isSavedItem(id: string): boolean {
  return /item\:.{20}/.test(id);
}

const schema = invoice.omit({ id: true }).extend({
  customer: customer.omit({ lastInvoice: true }),
  items: z.array(item).min(1),
});

export type InvoiceFormValue = z.infer<typeof schema>;

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
      resolver: zodResolver(schema),
    });

  const onSubmit = handleSubmit(
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
    (errors) => console.error(errors),
  );

  return (
    <Container as="section" className="py-10 ">
      <Heading title="Create new invoice" />

      <FormProvider
        {...methods}
        handleSubmit={handleSubmit}
        register={register}
        control={control}
        watch={watch}
      >
        <Form className="mt-2 flex flex-col gap-2" onSubmit={onSubmit}>
          <Controller
            control={control}
            name="customer"
            render={({ field: { onChange } }) => (
              <Select
                label="Customer"
                name="customer"
                options={(customers?.data?.customers?.results || [])?.map(
                  (customer) => ({
                    label: customer.name,
                    value: customer.id,
                  }),
                )}
                onChange={(option) => {
                  if (option) {
                    const customer = customers?.data?.customers?.results?.find(
                      (c) => c.id === option.value,
                    );

                    if (customer) {
                      onChange(customer);
                    }
                  }
                }}
              />
            )}
          />

          <TextArea label="Project Description" {...register("description")} />

          <div className="flex flex-row w-full gap-2">
            <Controller
              control={control}
              name="emitted"
              render={({ field: { value, onChange } }) => (
                <Input
                  className="w-full"
                  label="Due Date"
                  name="emitted"
                  type="date"
                  required
                  value={format(new Date(value), "yyyy-MM-dd")}
                  onChange={(due) => onChange(due.toISOString())}
                />
              )}
            />

            <Controller
              control={control}
              name="due"
              render={({ field: { value, onChange } }) => (
                <Input
                  className="w-full"
                  label="Due Date"
                  name="due"
                  type="date"
                  min={format(new Date(watch("emitted")), "yyyy-MM-dd")}
                  required
                  value={format(new Date(value), "yyyy-MM-dd")}
                  onChange={(due) => onChange(due.toISOString())}
                  validations={{
                    tooShort: "Pick a later date!",
                  }}
                />
              )}
            />
          </div>

          <InvoiceItemsTable />

          <Button
            loading={items.loading || invoices.isLoading}
            disabled={!methods.formState.isValid}
            size="lg"
            className="ml-auto px-6"
          >
            Save
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
}

CreateInvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
