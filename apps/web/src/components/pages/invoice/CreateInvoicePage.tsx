import { Root as Form } from "@radix-ui/react-form";
import { FormEventHandler, ReactElement, useState } from "react";
import { format } from "date-fns";

import { InputCreateInvoicesArgs } from "__generated__/graphql";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Input } from "components/atoms/input/Input";
import { Select } from "components/atoms/select/Select";
import { TextArea } from "components/atoms/textarea/TextArea";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { useCustomers } from "hooks/useCustomers";

import { InvoiceItemsTable } from "components/organisms/invoice-items-table/InvoiceItemsTable";

export function isSavedItem(id: string): boolean {
  return /item\:.{20}/.test(id);
}

export function CreateInvoicePage() {
  const customers = useCustomers();

  const [invoice, setInvoice] = useState<InputCreateInvoicesArgs>({
    description: "",
    status: "pending",
    customer: customers?.data?.customers?.results?.at(0)?.id || "",
    items: [],
    due: new Date().toISOString(),
    emitted: new Date().toISOString(),
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // try {
    //   await invoices.create({
    //     variables: {
    //       createInvoicesArgs: [invoice],
    //     },
    //   });
    // } catch (error: unknown) {
    //   console.error(error);
    // }
  };

  console.debug(invoice.items);

  return (
    <Container as="section" className="py-10 ">
      <Heading title="Create new invoice" />

      <Form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        {!customers.isLoading && customers.data && customers.data.customers && (
          <Select
            label="Customer"
            name="customer"
            options={customers.data.customers.results?.map((customer) => ({
              label: customer.name,
              value: customer.id,
            }))}
            onChange={(customer) =>
              setInvoice((curr) => ({
                ...curr,
                customer,
              }))
            }
          />
        )}

        <TextArea
          label="Project Description"
          name="description"
          value={invoice.description}
          onChange={(e) =>
            setInvoice((curr) => ({
              ...curr,
              description: e.target.value,
            }))
          }
        />

        <div className="flex flex-row w-full gap-2">
          <Input
            className="w-full"
            label="Invoice Date"
            name="emitted"
            type="date"
            required
            value={format(new Date(invoice.emitted), "yyyy-MM-dd")}
            onChange={(emitted) =>
              setInvoice((curr) => ({
                ...curr,
                emitted: emitted.toISOString(),
              }))
            }
          />
          <Input
            className="w-full"
            label="Due Date"
            name="due"
            type="date"
            required
            value={format(new Date(invoice.due), "yyyy-MM-dd")}
            onChange={(due) =>
              setInvoice((curr) => ({
                ...curr,
                due: due.toISOString(),
              }))
            }
          />
        </div>

        <InvoiceItemsTable invoice={invoice} setInvoice={setInvoice} />

        <Button size="lg" className="ml-auto px-6">
          Save
        </Button>
      </Form>
    </Container>
  );
}

CreateInvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
