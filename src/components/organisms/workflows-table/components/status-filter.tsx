import { Form } from "@radix-ui/react-form";
import { Dispatch, SetStateAction } from "react";
import { Select } from "components/atoms/select";

type Status = "active" | "inactive" | undefined;

type Props = {
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
};

const OPTIONS = [
  { label: "Active", value: "active" as const },
  { label: "Inactive", value: "inactive" as const },
];

export function StatusFilter({ status, setStatus }: Props) {
  const defaultValue = OPTIONS.find((option) => option.value === status);

  return (
    <Form>
      <Select
        name="status"
        label="Filter by status"
        options={OPTIONS}
        defaultValue={defaultValue}
        onChange={(option) => setStatus(option?.value)}
        isClearable
      />
    </Form>
  );
}
