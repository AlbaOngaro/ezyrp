import { Root as Form } from "@radix-ui/react-form";
import { useFormContext } from "react-hook-form";
import { Item } from "__generated__/graphql";
import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { TextArea } from "components/atoms/textarea/TextArea";

export function ItemForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = useFormContext<Item>();

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
      />

      <TextArea label="Description" {...register("description")} />

      <div className="flex flex-row gap-4 w-full">
        <Input
          className="w-full"
          label="Price (CHF)"
          type="number"
          step={0.05}
          {...register("price", {
            valueAsNumber: true,
            required: true,
          })}
        />

        <Input
          className="w-full"
          label="Quantity (Stock)"
          type="number"
          {...register("quantity", {
            valueAsNumber: true,
            required: true,
          })}
        />
      </div>

      <Button
        loading={isSubmitted}
        disabled={!isValid}
        type="submit"
        size="lg"
        className="w-fit min-w-[100px] mt-4 ml-auto"
      >
        Save
      </Button>
    </Form>
  );
}
