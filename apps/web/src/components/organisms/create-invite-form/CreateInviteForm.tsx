import { Form } from "@radix-ui/react-form";
import { useFormContext } from "react-hook-form";
import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { InputCreateInviteArgs } from "__generated__/graphql";

export function CreateInviteForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useFormContext<InputCreateInviteArgs>();

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Input
        label="Email address"
        type="email"
        {...register("email", { required: true })}
      />
      <Button
        disabled={!isValid}
        loading={isSubmitting}
        size="lg"
        className="w-fit ml-auto"
      >
        Invite
      </Button>
    </Form>
  );
}
