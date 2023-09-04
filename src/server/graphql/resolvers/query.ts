import { Surreal } from "surrealdb.js";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

import { Country, QueryResolvers, Stats, User } from "__generated__/server";

import { getDiffPercentage } from "lib/utils/getDiffPercentage";

import { surreal } from "server/surreal";
import { CustomersService } from "server/services/customers";
import { InvoicesService } from "server/services/invoices";
import { EventsService } from "server/services/events";
import { ProfileService } from "server/services/profile";

export const user: QueryResolvers["user"] = async (_, __, { accessToken }) => {
  await surreal.authenticate(accessToken as string);
  const user = await (surreal as Surreal).info();
  const profileService = new ProfileService(accessToken as string);
  const profile = await profileService.read();

  return {
    ...(user as Omit<User, "profile">),
    profile,
  };
};

export const customer: QueryResolvers["customer"] = async (
  _,
  args,
  { accessToken },
) => {
  const customersService = new CustomersService(accessToken as string);
  return customersService.read(args.id);
};

export const customers: QueryResolvers["customers"] = async (
  _,
  args,
  { accessToken },
) => {
  const customersService = new CustomersService(accessToken as string);
  return customersService.list(args.filters);
};

export const invoice: QueryResolvers["invoice"] = async (
  _,
  args,
  { accessToken },
) => {
  const invoicesService = new InvoicesService(accessToken as string);
  return invoicesService.read(args.id);
};

export const invoices: QueryResolvers["invoices"] = async (
  _,
  __,
  { accessToken },
) => {
  const invoicesService = new InvoicesService(accessToken as string);
  return invoicesService.list();
};

export const event: QueryResolvers["event"] = async (
  _,
  args,
  { accessToken },
) => {
  const eventsService = new EventsService(accessToken as string);
  return eventsService.read(args.id);
};

export const events: QueryResolvers["events"] = async (
  _,
  __,
  { accessToken },
) => {
  const eventsService = new EventsService(accessToken as string);
  return eventsService.list();
};

export const countries: QueryResolvers["countries"] = async () => {
  return fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((countries: Country[]) =>
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
    );
};

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
          status,
          math::sum(
            (SELECT price * quantity as amount FROM $this.items).amount
          ) as amounts
        FROM invoice 
        WHERE time::yday(time::now()) - time::yday(emitted) < $period;
  
        SELECT
          emitted,
          status,
          math::sum(
            (SELECT price * quantity as amount FROM $this.items).amount
          ) as amounts
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

export const getCloudinarySignature: QueryResolvers["getCloudinarySignature"] =
  async () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "crm",
      },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return {
      timestamp,
      signature,
      cloudname: process.env.CLOUDINARY_CLOUD_NAME as string,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
    };
  };
