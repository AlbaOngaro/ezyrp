import { Form } from "@radix-ui/react-form";
import { Dispatch, SetStateAction, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "components/atoms/input";

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

export function NameFilter({ query, setQuery }: Props) {
  const [value, setValue] = useState(query);
  const setDebouncedQuery = useDebouncedCallback(setQuery, 250);

  return (
    <Form>
      <Input
        name="name"
        type="search"
        label="Filter by name"
        placeholder="Search by name"
        value={value}
        defaultValue={query}
        autoComplete="off"
        onChange={(e) => {
          setValue(e.target.value);
          setDebouncedQuery(e.target.value);
        }}
      />
    </Form>
  );
}
