import { Form } from "@radix-ui/react-form";
import { Controller, useFormContext } from "react-hook-form";
import { InviteMemberFormValue } from "../team-settings/types";
import { useLoadRoles } from "./useLoadRoles";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { Select } from "components/atoms/select";

export function CreateInviteForm() {
  const roles = useLoadRoles();

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useFormContext<InviteMemberFormValue>();

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

      <Controller
        name="role"
        render={({ field: { value, onChange } }) => (
          <Select
            name="role"
            label="Role"
            options={roles}
            value={roles?.find((role) => role.value === value)}
            onChange={(option) => onChange(option?.value)}
          />
        )}
      />

      <Button
        disabled={!isValid}
        loading={isSubmitting}
        className="w-fit ml-auto"
      >
        Invite
      </Button>
    </Form>
  );
}
