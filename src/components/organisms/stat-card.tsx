import { FunctionReturnType } from "convex/server";
import { capitalize } from "lodash";
import { Calendar, PiggyBank, UserPlus } from "lucide-react";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { CHF } from "lib/formatters/chf";

export type Stats = FunctionReturnType<typeof api.stats.get>;

type Props = {
  type: keyof Stats;
  value: Stats[keyof Stats];
};

export function StatCard({ type, value }: Props) {
  switch (type) {
    case "customers": {
      return (
        <Card className="p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center">
          {capitalize(type)} <UserPlus className="h-4 w-4" />
          <strong className="text-2xl col-span-2">+{value.current}</strong>
          <small className="text-xs text-muted-foreground">
            {value.growth}%
          </small>
        </Card>
      );
    }
    case "events": {
      return (
        <Card className="p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center">
          {capitalize(type)} <Calendar className="h-4 w-4" />
          <strong className="text-2xl col-span-2">+{value.current}</strong>
          <small className="text-xs text-muted-foreground">
            {value.growth}%
          </small>
        </Card>
      );
    }
    case "revenue": {
      return (
        <Card className="p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center">
          {capitalize(type)} <PiggyBank className="h-4 w-4" />
          <strong className="text-2xl col-span-2">
            {CHF.format(value.current)}
          </strong>
          <small className="text-xs text-muted-foreground">
            {value.growth}%
          </small>
        </Card>
      );
    }
    default:
      return null;
  }
}
