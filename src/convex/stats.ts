import { filter } from "convex-helpers/server/filter";
import {
  addDays,
  differenceInDays,
  isWithinInterval,
  parseISO,
} from "date-fns";
import {
  DocumentByInfo,
  GenericQueryCtx,
  TableNamesInDataModel,
  NamedTableInfo,
} from "convex/server";
import { query } from "./_generated/server";
import { range } from "./schema";
import { getAuthData } from "./utils";
import { DataModel } from "./_generated/dataModel";

type Range = {
  start: Date;
  end: Date;
};

type AllowedTableNames = "customers" | "events" | "invoices";

type AllowedTables = Pick<DataModel, AllowedTableNames>;

type Args<TableName extends AllowedTableNames> = {
  table: TableNamesInDataModel<Pick<DataModel, TableName>>;
  range: Range;
};

type Result<TableName extends AllowedTableNames> = DocumentByInfo<
  NamedTableInfo<AllowedTables, TableName>
>;

async function getEntitiesInRange<TableName extends AllowedTableNames>(
  ctx: GenericQueryCtx<DataModel>,
  { table, range: { start, end } }: Args<TableName>,
): Promise<Result<TableName>[]> {
  const { workspace } = await getAuthData(ctx);

  return await filter(
    ctx.db
      .query(table)
      // @ts-ignore
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace)),
    (entity) => {
      const creation_time = new Date(entity._creationTime);

      return isWithinInterval(creation_time, {
        start,
        end,
      });
    },
  ).collect();
}

export function getPercentageChange(current: number, previous: number): number {
  return ((current - previous) / Math.max(Math.abs(previous), 1)) * 100;
}

export const get = query({
  args: {
    range,
  },
  handler: async (ctx, { range }) => {
    const current_range_start = parseISO(range.start);
    const current_range_end = parseISO(range.end);

    const diff = differenceInDays(current_range_start, current_range_end);

    const prev_range_start = addDays(current_range_start, diff);
    const prev_range_end = addDays(current_range_end, diff);

    const customers_in_current_range = await getEntitiesInRange(ctx, {
      table: "customers",
      range: {
        start: current_range_start,
        end: current_range_end,
      },
    });

    const customers_in_previous_range = await getEntitiesInRange(ctx, {
      table: "customers",
      range: {
        start: prev_range_start,
        end: prev_range_end,
      },
    });

    const events_in_current_range = await getEntitiesInRange(ctx, {
      table: "events",
      range: {
        start: current_range_start,
        end: current_range_end,
      },
    });

    const events_in_previous_range = await getEntitiesInRange(ctx, {
      table: "events",
      range: {
        start: prev_range_start,
        end: prev_range_end,
      },
    });

    const invoices_in_current_range = await getEntitiesInRange(ctx, {
      table: "invoices",
      range: {
        start: current_range_start,
        end: current_range_end,
      },
    });

    const invoices_in_previous_range = await getEntitiesInRange(ctx, {
      table: "invoices",
      range: {
        start: prev_range_start,
        end: prev_range_end,
      },
    });

    const current_customers = customers_in_current_range.length;
    const previous_customers = customers_in_previous_range.length;

    const current_events = events_in_current_range.length;
    const previous_events = events_in_previous_range.length;

    const current_revenue =
      invoices_in_current_range
        .filter((invoice) => invoice.status === "paid")
        .reduce((acc, curr) => acc + curr.amount, 0) / 100;

    const previous_revenue =
      invoices_in_previous_range
        .filter((invoice) => invoice.status === "paid")
        .reduce((acc, curr) => acc + curr.amount, 0) / 100;

    return {
      customers: {
        current: current_customers,
        previous: previous_customers,
        growth: getPercentageChange(current_customers, previous_customers),
      },
      events: {
        current: current_events,
        previous: previous_events,
        growth: getPercentageChange(current_events, previous_events),
      },
      revenue: {
        current: current_revenue,
        previous: previous_revenue,
        growth: getPercentageChange(current_revenue, previous_revenue),
      },
    };
  },
});
