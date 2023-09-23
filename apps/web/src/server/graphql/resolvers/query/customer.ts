import { QueryResolvers } from "../../../../__generated__/server";
import {
  inputCustomerFilters,
  inputCustomersOrderBy,
} from "../../../schema/customer";

import { CustomersService } from "../../../services/customers";

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
  return customersService.list(
    inputCustomerFilters.parse(args.filters || {}),
    inputCustomersOrderBy.parse(args.orderBy || {}),
  );
};
