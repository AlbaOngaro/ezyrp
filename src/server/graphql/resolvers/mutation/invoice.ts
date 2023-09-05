import { GraphQLError } from "graphql";
import { ZodError, z } from "zod";
import { MutationResolvers } from "__generated__/server";
import { invoice } from "server/schema/invoice";
import { InvoicesService } from "server/services/invoices";

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
