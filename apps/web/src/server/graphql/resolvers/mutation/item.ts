import { MutationResolvers } from "../../../../__generated__/server";
import { ItemsService } from "../../../services/items";

export const createItems: MutationResolvers["createItems"] = async (
  _,
  args,
  { accessToken },
) => {
  const itemsService = new ItemsService(accessToken as string);
  return itemsService.create(args.createItemsInput);
};
