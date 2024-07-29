import { useOnobardingFormContext } from "../hooks/useOnobardingFormContext";
import { Input } from "components/atoms/input";

export function WorkspaceStep() {
  const { register } = useOnobardingFormContext();

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
