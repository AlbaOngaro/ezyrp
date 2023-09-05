import { QueryResolvers } from "__generated__/server";

import { CustomersService } from "server/services/customers";

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
