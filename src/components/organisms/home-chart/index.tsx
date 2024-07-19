import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { chartConfig } from "./constants";

import { cn } from "lib/utils/cn";
import { api } from "convex/_generated/api";

import { ChartContainer } from "components/atoms/chart";
import { Card } from "components/atoms/card";
import { Heading } from "components/atoms/heading";
import { useQuery } from "lib/hooks/useQuery";
import { Skeleton } from "components/atoms/skeleton";

type Props = {
  className?: string;
};

export function HomeChart({ className }: Props) {
  const { data, status } = useQuery(api.stats.monthly, {
    year: 2024,
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  });

  if (status !== "success") {
    return <Skeleton className={cn("h-96", className)} />;
  }

  return (
    <Card className={cn("p-4", className)}>
      <Heading title="Overview" className="mb-4" />

      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <Bar dataKey="invoices" fill="var(--color-invoices)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
