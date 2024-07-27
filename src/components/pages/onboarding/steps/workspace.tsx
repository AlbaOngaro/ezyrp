import { useFormContext } from "react-hook-form";
import { FormValue } from "../types";
import { Input } from "components/atoms/input";

export function WorkspaceStep() {
  const { register } = useFormContext<FormValue>();

  return (
    <Input
      label="Workspace name"
      placeholder="Acme"
      validations={{
        valueMissing: "Please enter a workspace name",
      }}
      {...register("name", { required: true })}
    />
  );
}
