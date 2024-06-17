import { Form } from "@radix-ui/react-form";
import { Controller, useFormContext } from "react-hook-form";
import { addMonths, format } from "date-fns";

import { InvoiceItemsTable } from "./invoice-items-table/InvoiceItemsTable";

import { Select } from "components/atoms/select/Select";
import { TextArea } from "components/atoms/textarea/TextArea";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";

import { useCustomers } from "hooks/useCustomers";

export function InvoiceForm() {
  const customers = useCustomers();

  const { control, register, watch, formState, handleSubmit } =
    useFormContext();

  return (
    <Form
      className="mt-2 flex flex-col gap-2"
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Controller
        control={control}
        name="customer"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Customer"
            name="customer"
            value={value ? { label: value.name, value: value.id } : undefined}
            options={(customers?.data || [])?.map((customer) => ({
              label: customer.name,
              value: customer._id,
            }))}
            onChange={(option) => {
              if (option) {
                const customer = customers?.data?.find(
                  (c) => c._id === option.value,
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
          render={({
            field: { value = new Date().toISOString(), onChange },
          }) => (
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
              min={format(
                addMonths(
                  new Date(watch("emitted", new Date().toISOString())),
                  1,
                ),
                "yyyy-MM-dd",
              )}
              required
              value={
                value
                  ? format(new Date(value), "yyyy-MM-dd")
                  : format(
                    addMonths(
                      new Date(watch("emitted", new Date().toISOString())),
                      1,
                    ),
                    "yyyy-MM-dd",
                  )
              }
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
        loading={formState.isSubmitting}
        disabled={!formState.isValid}
        size="lg"
        className="ml-auto px-6"
      >
        Save
      </Button>
    </Form>
  );
}
