import { Table } from "components/atoms/table/Table";
import { useCustomers } from "hooks/useCustomers";

export function HomePage() {
  const { customers } = useCustomers();

  return (
    <main>
      <Table people={customers} />
    </main>
  );
}
