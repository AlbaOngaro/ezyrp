import { filter } from "convex-helpers/server/filter";
import {
  addDays,
  differenceInDays,
  format,
  isWithinInterval,
  lastDayOfMonth,
  setHours,
  setMinutes,
} from "date-fns";
import {
  DocumentByInfo,
  GenericQueryCtx,
  TableNamesInDataModel,
  NamedTableInfo,
} from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthData } from "./utils";
import { DataModel, Doc } from "./_generated/dataModel";

const rangeArgValidator = v.object({
  start: v.number(),
  end: v.number(),
});

type Range = {
  start: number;
  end: number;
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

async function getPaidInvoicesInRange(
  ctx: GenericQueryCtx<DataModel>,
  { range: { start, end } }: { range: Range },
) {
  const { workspace } = await getAuthData(ctx);

  const docs = await ctx.db
    .query("invoices")
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .filter((q) =>
      q.and(
        q.eq(q.field("status"), "paid"),
        q.gte(q.field("_creationTime"), start),
        q.lte(q.field("_creationTime"), end),
      ),
    )
    .take(5);

  const invoices = [];

  for (const doc of docs) {
    const items = await Promise.all(doc.items.map((id) => ctx.db.get(id)));
    const customer = await ctx.db.get(doc.customer);
    if (!customer) {
      throw new ConvexError("Customer not found");
    }

    invoices.push({
      ...doc,
      items: items.filter((item) => item !== null) as Doc<"items">[],
      customer,
    });
  }

  return invoices;
}

export const range = query({
  args: {
    range: rangeArgValidator,
  },
  handler: async (ctx, { range }) => {
    const current_range_start = range.start;
    const current_range_end = range.end;

    const diff = differenceInDays(current_range_start, current_range_end);

    const prev_range_start = addDays(current_range_start, diff).getTime();
    const prev_range_end = addDays(current_range_end, diff).getTime();

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

    const invoices_in_current_range = await getPaidInvoicesInRange(ctx, {
      range: {
        start: current_range_start,
        end: current_range_end,
      },
    });

    const invoices_in_previous_range = await getPaidInvoicesInRange(ctx, {
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
        current: customers_in_current_range,
        previous: customers_in_previous_range,
        growth: getPercentageChange(current_customers, previous_customers),
      },
      events: {
        current: events_in_current_range,
        previous: events_in_previous_range,
        growth: getPercentageChange(current_events, previous_events),
      },
      revenue: {
        current: current_revenue,
        previous: previous_revenue,
        growth: getPercentageChange(current_revenue, previous_revenue),
      },
      invoices: {
        current: invoices_in_current_range,
        previous: invoices_in_previous_range,
        growth: getPercentageChange(
          invoices_in_current_range.length,
          invoices_in_previous_range.length,
        ),
      },
    };
  },
});

export const monthly = query({
  args: {
    year: v.number(),
    months: v.array(v.number()),
  },
  handler: async (ctx, { year, months }) => {
    const { workspace } = await getAuthData(ctx);

    const data = [];

    for (const month of months) {
      const start = new Date(year, month, 1).getTime();
      const end = setMinutes(
        setHours(lastDayOfMonth(new Date(year, month)), 23),
        59,
      ).getTime();

      const docs = await ctx.db
        .query("invoices")
        .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
        .filter((q) =>
          q.and(
            q.eq(q.field("status"), "paid"),
            q.gte(q.field("_creationTime"), start),
            q.lte(q.field("_creationTime"), end),
          ),
        )
        .collect();

      data.push({
        month: format(start, "MMM"),
        invoices: docs.length,
      });
    }

    return data;
  },
});
