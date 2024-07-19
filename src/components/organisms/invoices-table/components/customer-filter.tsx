import { Form } from "@radix-ui/react-form";
import { Dispatch, SetStateAction } from "react";
import { Select } from "components/atoms/select";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { Id } from "convex/_generated/dataModel";

type Props = {
  customerId: string | undefined;
  setCustomerId: Dispatch<SetStateAction<Id<"customers"> | undefined>>;
};

export function CustomerFilter({ customerId, setCustomerId }: Props) {
  const { data: customers = [] } = useQuery(api.customers.list);

  const options = (customers || []).map((customer) => ({
    label: customer.name,
    value: customer._id,
  }));

  const defaultValue = options.find((option) => option.value === customerId);

  return (
    <Form>
      <Select
        name="customer_id"
        label="Filter by customer"
        options={options}
        defaultValue={defaultValue}
        onChange={(option) => {
          if (option) {
            setCustomerId(option.value);
          } else {
            setCustomerId(undefined);
          }
        }}
        isClearable
      />
    </Form>
  );
}
