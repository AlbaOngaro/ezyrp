import { Form } from "@radix-ui/react-form";
import { Dispatch, SetStateAction } from "react";
import { Select } from "components/atoms/select";

type Status = "due" | "overdue" | "paid";

type Props = {
  status?: Status;
  setStatus: Dispatch<SetStateAction<Status | undefined>>;
};

const OPTIONS = [
  { label: "Due", value: "due" as const },
  { label: "Paid", value: "paid" as const },
  { label: "Overdue", value: "overdue" as const },
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
        onChange={(option) => {
          if (option) {
            setStatus(option.value);
          } else {
            setStatus(undefined);
          }
        }}
        isClearable
      />
    </Form>
  );
}
