import { QueryResolvers } from "__generated__/server";
import { inputItemFilters } from "server/schema/inventory";
import { ItemsService } from "server/services/items";

export const items: QueryResolvers["items"] = async (
  _,
  args,
  { accessToken },
) => {
  const itemsService = new ItemsService(accessToken as string);
  return await itemsService.list(inputItemFilters.parse(args.filters || {}));
};
