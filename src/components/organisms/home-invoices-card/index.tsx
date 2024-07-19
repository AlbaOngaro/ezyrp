import { FunctionReturnType } from "convex/server";
import { Avatar } from "components/atoms/avatar";
import { Card } from "components/atoms/card";
import { api } from "convex/_generated/api";
import { Heading } from "components/atoms/heading";
import { cn } from "lib/utils/cn";
import { Id } from "convex/_generated/dataModel";
import { CHF } from "lib/formatters/chf";

type Props = {
  invoices: FunctionReturnType<typeof api.stats.get>["invoices"];
  className?: string;
};

type Group = {
  id: Id<"customers">;
  name: string;
  email: string;
  total: number;
};

export function HomeInvoicesCard({ className, invoices }: Props) {
  const total = invoices.current.length || 0;
  const description = `You closed ${total} invoices this period.`;

  const grouped = invoices.current.reduce((acc, invoice) => {
    if (acc.some((g) => g.id === invoice.customer._id)) {
      return acc.map((g) => {
        if (g.id === invoice.customer._id) {
          return { ...g, total: g.total + invoice.amount };
        }
        return g;
      });
    } else {
      return [
        ...acc,
        {
          id: invoice.customer._id,
          name: invoice.customer.name,
          email: invoice.customer.email,
          total: invoice.amount,
        },
      ];
    }
  }, [] as Group[]);

  return (
    <Card className={cn("p-4", className)}>
      <Heading title="Recent invoices" description={description} />

      <ul className="flex flex-col gap-3 mt-4">
        {grouped.map((customer) => (
          <li
            key={customer.id}
            className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 items-center"
          >
            <Avatar className="w-10 h-10" seed={customer.email} />
            <div className="flex flex-col">
              <strong>{customer.name}</strong>
              <small>{customer.email}</small>
            </div>
            <strong className="text-right">
              {CHF.format(customer.total / 100)}
            </strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}
