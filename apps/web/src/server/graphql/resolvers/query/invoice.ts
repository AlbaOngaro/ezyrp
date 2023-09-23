import { QueryResolvers } from "../../../../__generated__/server";
import { inputInvoiceFilters } from "../../../schema/invoice";

import { InvoicesService } from "../../../services/invoices";

export const invoice: QueryResolvers["invoice"] = async (
  _,
  args,
  { accessToken },
) => {
  const invoicesService = new InvoicesService(accessToken as string);
  return invoicesService.read(args.id);
};

export const invoices: QueryResolvers["invoices"] = async (
  _,
  args,
  { accessToken },
) => {
  const invoicesService = new InvoicesService(accessToken as string);
  return await invoicesService.list(
    inputInvoiceFilters.parse(args.filters || {}),
  );
};
