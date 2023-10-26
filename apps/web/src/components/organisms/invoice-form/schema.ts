import { z } from "zod";

import { customer } from "server/schema/customer";
import { item } from "server/schema/inventory";
import { invoice } from "server/schema/invoice";

export const schema = invoice
  .omit({ id: true, created_at: true, updated_at: true })
  .extend({
    customer: customer.omit({ lastInvoice: true }),
    items: z.array(item).min(1),
  });

export type InvoiceFormValue = z.infer<typeof schema>;
