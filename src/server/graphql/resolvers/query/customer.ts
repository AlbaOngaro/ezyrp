import { QueryResolvers } from "__generated__/server";
import { inputCustomerFilters } from "server/schema/customer";

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
  return customersService.list(inputCustomerFilters.parse(args.filters || {}));
};
