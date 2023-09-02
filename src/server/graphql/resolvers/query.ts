import { Surreal } from "surrealdb.js";
import { surreal } from "server/surreal";
import { QueryResolvers, User } from "__generated__/server";
import { CustomersService } from "server/services/customers";
import { InvoicesService } from "server/services/invoices";
import { EventsService } from "server/services/events";

export const user: QueryResolvers["user"] = async (_, __, { accessToken }) => {
  await surreal.authenticate(accessToken as string);
  const record = await (surreal as Surreal).info();
  return record as User;
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
