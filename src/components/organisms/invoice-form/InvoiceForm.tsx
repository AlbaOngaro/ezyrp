import { Form } from "@radix-ui/react-form";
import { Controller, useFormContext } from "react-hook-form";
import { addMonths, format } from "date-fns";

import { InvoiceItemsTable } from "./invoice-items-table";

import { Select } from "components/atoms/select";
import { TextArea } from "components/atoms/textarea";
import { Input } from "components/atoms/input";
import { Button } from "components/atoms/button";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

type Props = {
  disabled?: boolean;
};

export function InvoiceForm({ disabled }: Props) {
  const { data: customers = [] } = useQuery(api.customers.list);
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
            name="custsomer"
            isDisabled={disabled}
            value={value}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            options={customers || []}
            onChange={(option) => {
              if (option) {
                onChange(option);
              }
            }}
          />
        )}
      />

      <TextArea
        disabled={disabled}
        label="Project Description"
        {...register("description")}
      />

      <div className="flex flex-row w-full gap-2">
        <Controller
          control={control}
          name="emitted"
          render={({
            field: { value = new Date().toISOString(), onChange },
          }) => (
            <Input
              disabled={disabled}
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
              disabled={disabled}
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

      <InvoiceItemsTable disabled={disabled} />

      {!disabled && (
        <Button
          loading={formState.isSubmitting}
          disabled={!formState.isValid}
          className="ml-auto px-6"
        >
          Save
        </Button>
      )}
    </Form>
  );
}
