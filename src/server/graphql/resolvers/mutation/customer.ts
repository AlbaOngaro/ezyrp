import { GraphQLError } from "graphql";
import { ZodError, z } from "zod";

import { MutationResolvers } from "__generated__/server";

import { customer } from "server/schema/customer";
import { CustomersService } from "server/services/customers";

export const createCustomers: MutationResolvers["createCustomers"] = async (
  _,
  args,
  { accessToken },
) => {
  const customers = await z
    .array(customer.omit({ id: true, lastInvoice: true }))
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
  return customersService.update(customers);
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
