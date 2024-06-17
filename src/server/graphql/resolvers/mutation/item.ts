import { GraphQLError } from "graphql";
import { ZodError, z } from "zod";
import { MutationResolvers } from "__generated__/server";
import { item } from "server/schema/inventory";
import { ItemsService } from "server/services/items";

export const createItems: MutationResolvers["createItems"] = async (
  _,
  args,
  { accessToken },
) => {
  const items = await z
    .array(item.omit({ id: true }))
    .parseAsync(args.createItemsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const itemsService = new ItemsService(accessToken as string);
  return itemsService.create(items);
};

export const updateItems: MutationResolvers["updateItems"] = async (
  _,
  args,
  { accessToken },
) => {
  const items = await z
    .array(item.omit({ onetime: true }))
    .parseAsync(args.updateItemsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const itemsService = new ItemsService(accessToken as string);
  return itemsService.update(items);
};

export const deleteItems: MutationResolvers["deleteItems"] = async (
  _,
  args,
  { accessToken },
) => {
  const items = await z
    .array(z.string())
    .parseAsync(args.deleteItemsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const itemsService = new ItemsService(accessToken as string);
  return itemsService.delete(items);
};
