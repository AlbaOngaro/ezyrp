import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export type Customers = {
  data: Customer[];
  has_more: boolean;
  next_page: any;
  object: string;
  url: string;
};

export type Customer = {
  address: Address;
  balance: number;
  created: number;
  currency: string;
  default_currency: string;
  default_source: any;
  delinquent: boolean;
  description: any;
  discount: any;
  email: string;
  id: string;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Metadata;
  name: string;
  next_invoice_sequence: number;
  object: string;
  phone: any;
  preferred_locales: string[];
  shipping: any;
  tax_exempt: string;
  test_clock: any;
};

type Metadata = {};

type Address = {
  city: any;
  country: string;
  line1: any;
  line2: any;
  postal_code: any;
  state: any;
};

type InvoiceSettings = {
  custom_fields: any;
  default_payment_method: any;
  footer: any;
  rendering_options: any;
};

export const search = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (_, { email }): Promise<Customers["data"][number]> => {
    const response = await fetch(
      `https://api.stripe.com/v1/customers/search?${new URLSearchParams({
        query: `email~"${email}"`,
      }).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${process.env.STRIPE_SECRET_KEY}:`),
        },
      },
    );
    const body = (await response.json()) as Customers;
    return body.data[0];
  },
});
