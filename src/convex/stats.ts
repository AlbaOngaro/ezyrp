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

    return {
      customers: {
        current: customers_in_current_range.length,
        previous: customers_in_previous_range.length,
      },
      events: {
        current: events_in_current_range.length,
        previous: events_in_previous_range.length,
      },
      revenue: {
        current:
          invoices_in_current_range
            .filter((invoice) => invoice.status === "paid")
            .reduce((acc, curr) => acc + curr.amount, 0) / 100,
        previous:
          invoices_in_previous_range
            .filter((invoice) => invoice.status === "paid")
            .reduce((acc, curr) => acc + curr.amount, 0) / 100,
      },
    };
  },
});
