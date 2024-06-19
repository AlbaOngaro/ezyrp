import { Root as Form } from "@radix-ui/react-form";
import { useFormContext } from "react-hook-form";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { TextArea } from "components/atoms/textarea";
import { Doc } from "convex/_generated/dataModel";

type Props = {
  disabled?: boolean;
};

export function ItemForm({ disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = useFormContext<Doc<"items">>();

  return (
    <Form
      className="mt-2 flex flex-col gap-4"
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Input
        {...register("name", {
          required: true,
        })}
        label="Name"
        required
        validations={{
          valueMissing: "This field is required",
        }}
        disabled={disabled}
      />

      <TextArea
        label="Description"
        disabled={disabled}
        {...register("description")}
      />

      <div className="flex flex-row gap-4 w-full">
        <Input
          className="w-full"
          label="Price (CHF)"
          type="number"
          step={0.05}
          disabled={disabled}
          {...register("price", {
            valueAsNumber: true,
            required: true,
          })}
        />

        <Input
          className="w-full"
          label="Quantity (Stock)"
          type="number"
          disabled={disabled}
          {...register("quantity", {
            valueAsNumber: true,
            required: true,
          })}
        />
      </div>

      {!disabled && (
        <Button
          loading={isSubmitted}
          disabled={!isValid}
          type="submit"
          className="w-fit min-w-[100px] mt-4 ml-auto"
        >
          Save
        </Button>
      )}
    </Form>
  );
}
