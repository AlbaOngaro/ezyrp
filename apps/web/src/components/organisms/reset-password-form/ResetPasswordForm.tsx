import { Form } from "@radix-ui/react-form";
import { useFormContext } from "react-hook-form";
import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { InputResetPasswordCredentials } from "__generated__/graphql";

export function ResetPasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { isValid, isSubmitting },
  } = useFormContext<InputResetPasswordCredentials>();

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Input
        type="password"
        label="Current password"
        {...register("currentPassword", { required: true })}
      />
      <Input
        type="password"
        label="New password"
        {...register("newPassword", { required: true })}
      />
      <Input
        type="password"
        label="Confirm password"
        {...register("confirmPassword", {
          required: true,
          validate: (value, formValues) => value === formValues.newPassword,
        })}
      />

      <Button
        size="lg"
        className="px-6 w-fit"
        disabled={!isValid}
        loading={isSubmitting}
      >
        Save
      </Button>
    </Form>
  );
}
