import { GraphQLError } from "graphql";
import { z } from "zod";
import { QueryResolvers, Stats } from "__generated__/server";
import { surreal } from "server/surreal";
import { getDiffPercentage } from "lib/utils/getDiffPercentage";

export const stats: QueryResolvers["stats"] = async (
  _,
  args,
  { accessToken },
) => {
  try {
    await surreal.authenticate(accessToken as string);
  } catch (error: unknown) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  const period = args.filters?.period;

  if (period && period > 0) {
    const records = await surreal.query(
      `
        SELECT
          *, 
          math::sum(items.price) as amount,
          (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
          IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
        FROM invoice 
        WHERE time::yday(time::now()) - time::yday(emitted) < $period;
  
        SELECT
          *, 
          math::sum(items.price) as amount,
          (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
          IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
        FROM invoice
        WHERE 
          time::yday(time::now()) - time::yday(emitted) < ($period * 2) 
        AND
          time::yday(time::now()) - time::yday(emitted) > $period;
    `,
      {
        period,
      },
    );

    const current = z
      .array(
        z.object({
          amount: z.number(),
          status: z.enum(["paid", "pending", "overdue"]),
        }),
      )
      .parse(records[0].result)
      .reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status]: acc[curr.status] + curr.amount,
        }),
        {
          pending: 0,
          paid: 0,
          overdue: 0,
        },
      );

    const previous = z
      .array(
        z.object({
          amount: z.number(),
          status: z.enum(["paid", "pending", "overdue"]),
        }),
      )
      .parse(records[1].result)
      .reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status]: acc[curr.status] + curr.amount,
        }),
        {
          pending: 0,
          paid: 0,
          overdue: 0,
        },
      );

    return Object.entries(current).reduce<Omit<Stats, "__typename">>(
      (acc, [key, value]) => {
        const stat = acc[key as keyof Omit<Stats, "__typename">];

        return {
          ...acc,
          [key]: {
            ...stat,
            value,
            change: getDiffPercentage(
              value,
              previous[key as keyof Omit<Stats, "__typename">],
            ),
          },
        };
      },
      {
        pending: {
          name: "Outstanding invoices",
          value: 0,
          change: 0,
        },
        paid: {
          name: "Revenue",
          value: 0,
          change: 0,
        },
        overdue: {
          name: "Overdue invoices",
          value: 0,
          change: 0,
        },
      },
    );
  }

  const records = await surreal.query(
    `
      SELECT
        status,
        math::sum(
          (SELECT price * quantity as amount FROM $this.items).amount
        ) as amounts
      FROM invoice;

      SELECT
        emitted,
        status,
        math::sum(
          (SELECT price * quantity as amount FROM $this.items).amount
        ) as amounts
      FROM invoice;
  `,
  );

  const current = z
    .array(
      z.object({
        amounts: z.number(),
        status: z.enum(["paid", "pending", "overdue"]),
      }),
    )
    .parse(records[0].result)
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.status]: acc[curr.status] + curr.amounts,
      }),
      {
        pending: 0,
        paid: 0,
        overdue: 0,
      },
    );

  const previous = z
    .array(
      z.object({
        amounts: z.number(),
        status: z.enum(["paid", "pending", "overdue"]),
      }),
    )
    .parse(records[1].result)
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.status]: acc[curr.status] + curr.amounts,
      }),
      {
        pending: 0,
        paid: 0,
        overdue: 0,
      },
    );

  return Object.entries(current).reduce<Omit<Stats, "__typename">>(
    (acc, [key, value]) => {
      const stat = acc[key as keyof Omit<Stats, "__typename">];

      return {
        ...acc,
        [key]: {
          ...stat,
          value,
          change: getDiffPercentage(
            value,
            previous[key as keyof Omit<Stats, "__typename">],
          ),
        },
      };
    },
    {
      pending: {
        name: "Outstanding invoices",
        value: 0,
        change: 0,
      },
      paid: {
        name: "Revenue",
        value: 0,
        change: 0,
      },
      overdue: {
        name: "Overdue invoices",
        value: 0,
        change: 0,
      },
    },
  );
};
