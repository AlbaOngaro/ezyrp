import { QueryResolvers } from "../../../../__generated__/server";
import { inputItemFilters } from "../../../schema/inventory";
import { ItemsService } from "../../../services/items";

export const items: QueryResolvers["items"] = async (
  _,
  args,
  { accessToken },
) => {
  const itemsService = new ItemsService(accessToken as string);
  return await itemsService.list(inputItemFilters.parse(args.filters || {}));
};

export const item: QueryResolvers["item"] = async (
  _,
  args,
  { accessToken },
) => {
  const itemsService = new ItemsService(accessToken as string);
  return await itemsService.read(args.id);
};
