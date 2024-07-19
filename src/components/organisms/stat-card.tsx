// @todo: remove this when the following issue is resolved
// @ts-nocheck
import { FunctionReturnType } from "convex/server";
import { capitalize } from "lodash";
import { Calendar, PiggyBank, UserPlus } from "lucide-react";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { CHF } from "lib/formatters/chf";
import { cn } from "lib/utils/cn";

export type Stats = FunctionReturnType<typeof api.stats.get>;

type Props = {
  type: keyof Stats;
  value: Stats[keyof Stats];
  className?: string;
};

function isCustomersProps(props: Props): props is {
  type: "customers";
  value: Stats["customers"];
  className?: string;
} {
  return props.type === "customers";
}

function isEventsProps(props: Props): props is {
  type: "events";
  value: Stats["events"];
  className?: string;
} {
  return props.type === "events";
}

function isRevenueProps(props: Props): props is {
  type: "revenue";
  value: Stats["revenue"];
  className?: string;
} {
  return props.type === "revenue";
}

export function StatCard(props: Props) {
  switch (true) {
    case isCustomersProps(props): {
      const { type, value, className } = props;

      return (
        <Card
          className={cn(
            "p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center",
            className,
          )}
        >
          {capitalize(type)} <UserPlus className="h-4 w-4" />
          <strong className="text-2xl col-span-2">
            +{value.current.length}
          </strong>
          <small className="text-xs text-muted-foreground">
            {value.growth}%
          </small>
        </Card>
      );
    }
    case isEventsProps(props): {
      const { className, value, type } = props;

      return (
        <Card
          className={cn(
            "p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center",
            className,
          )}
        >
          {capitalize(type)} <Calendar className="h-4 w-4" />
          <strong className="text-2xl col-span-2">
            +{value.current.length}
          </strong>
          <small className="text-xs text-muted-foreground">
            {value.growth}%
          </small>
        </Card>
      );
    }
    case isRevenueProps(props): {
      const { className, value, type } = props;

      return (
        <Card
          className={cn(
            "p-4 grid grid-cols-[2fr_1rem] gap-y-2 w-full justify-between items-center",
            className,
          )}
        >
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
