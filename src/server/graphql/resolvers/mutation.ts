import { GraphQLError } from "graphql";
import { destroyCookie, setCookie } from "nookies";
import { Surreal } from "surrealdb.js";
import { ZodError, z } from "zod";

import { ACCESS_TOKEN_ID } from "lib/constants";
import { surreal } from "server/surreal";
import { credentials } from "server/schema/auth";
import { MutationResolvers, User } from "__generated__/server";
import { CustomersService } from "server/services/customers";
import { customer } from "server/schema/customer";
import { invoice } from "server/schema/invoice";
import { InvoicesService } from "server/services/invoices";
import { createEventInput } from "server/schema/event";
import { EventsService } from "server/services/events";
import { ProfileService } from "server/services/profile";
import { profile } from "server/schema/profile";

export const login: MutationResolvers["login"] = async (_, args, { res }) => {
  const { password, email } = await credentials
    .partial({ workspace: true })
    .omit({ username: true })
    .parseAsync(args.credentials)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const token = await surreal
    .signin({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      email,
      password,
    })
    .catch(() => {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    });

  if (!token) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  setCookie({ res }, ACCESS_TOKEN_ID, token, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  const record = await (surreal as Surreal).info();
  return record as User;
};

export const register: MutationResolvers["register"] = async (
  _,
  args,
  { res },
) => {
  const { username, password, email, workspace } = await credentials
    .partial({ username: true, workspace: true })
    .parseAsync(args.credentials)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const token = await surreal
    .signup({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      workspace,
      username,
      password,
      email,
    })
    .catch(() => {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    });

  if (!token) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  setCookie({ res }, ACCESS_TOKEN_ID, token, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  const record = await (surreal as Surreal).info();
  return record as User;
};

export const logout: MutationResolvers["logout"] = async (_, __, { res }) => {
  destroyCookie({ res }, ACCESS_TOKEN_ID, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  return true;
};

export const updateUserProfile: MutationResolvers["updateUserProfile"] = async (
  _,
  args,
  { accessToken },
) => {
  const input = await profile
    .omit({ user: true })
    .partial({
      address: true,
      city: true,
      code: true,
      country: true,
      name: true,
    })
    .parseAsync(args.updateUserProfileArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const profileService = new ProfileService(accessToken as string);
  return profileService.update(input);
};

export const createCustomers: MutationResolvers["createCustomers"] = async (
  _,
  args,
  { accessToken },
) => {
  const customers = await z
    .array(customer.omit({ id: true, workspace: true }))
    .parseAsync(args.createCustomerArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const customersService = new CustomersService(accessToken as string);
  return customersService.create(customers);
};

export const updateCustomers: MutationResolvers["updateCustomers"] = async (
  _,
  args,
  { accessToken },
) => {
  const customers = await z
    .array(
      customer
        .omit({ lastInvoice: true })
        .partial({ email: true, phone: true, name: true }),
    )
    .parseAsync(args.updateCustomerArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const customersService = new CustomersService(accessToken as string);
  customersService.update(customers);
  return customersService.list();
};

export const deleteCustomers: MutationResolvers["deleteCustomers"] = async (
  _,
  args,
  { accessToken },
) => {
  const ids = await z
    .array(z.string())
    .parseAsync(args.deleteCustomerArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });
  const customersService = new CustomersService(accessToken as string);
  await customersService.delete(ids);

  return ids;
};

export const createInvoices: MutationResolvers["createInvoices"] = async (
  _,
  args,
  { accessToken },
) => {
  const invoices = await z
    .array(
      invoice
        .merge(
          z.object({
            customer: z.string(),
          }),
        )
        .omit({ id: true }),
    )
    .parseAsync(args.createInvoicesArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const invoicesService = new InvoicesService(accessToken as string);
  return invoicesService.create(invoices);
};

export const updateInvoices: MutationResolvers["updateInvoices"] = async (
  _,
  args,
  { accessToken },
) => {
  const invoices = await z
    .array(
      invoice
        .merge(
          z.object({
            customer: z.string(),
          }),
        )
        .partial({
          customer: true,
          description: true,
          status: true,
          items: true,
          emitted: true,
          due: true,
        }),
    )
    .parseAsync(args.updateInvoicesArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const invoicesService = new InvoicesService(accessToken as string);

  return invoicesService.update(invoices);
};

export const deleteInvoices: MutationResolvers["deleteInvoices"] = async (
  _,
  args,
  { accessToken },
) => {
  const ids = await z
    .array(z.string())
    .parseAsync(args.deleteInvoicesArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const invoicesService = new InvoicesService(accessToken as string);
  return invoicesService.delete(ids);
};

export const createEvents: MutationResolvers["createEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(createEventInput.omit({ id: true }))
    .parseAsync(args.createEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  return eventsService.create(events);
};

export const updateEvents: MutationResolvers["updateEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(
      createEventInput.partial({
        start: true,
        end: true,
        title: true,
        variant: true,
        guests: true,
      }),
    )
    .parseAsync(args.updateEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  eventsService.update(events);

  return eventsService.list();
};

export const deleteEvents: MutationResolvers["deleteEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(z.string())
    .parseAsync(args.deleteEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  return eventsService.delete(events);
};
