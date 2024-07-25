import { v } from "convex/values";
import { action } from "../_generated/server";

type InvoicesList = {
  data: Invoice[];
  has_more: boolean;
  object: string;
  url: string;
};

type Invoice = {
  account_country: string;
  account_name: string;
  account_tax_ids: any;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  application: any;
  application_fee_amount: any;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax: AutomaticTax;
  automatically_finalizes_at: any;
  billing_reason: string;
  charge: string;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: any;
  customer: string;
  customer_address: CustomerAddress;
  customer_email: string;
  customer_name: string;
  customer_phone: any;
  customer_shipping: any;
  customer_tax_exempt: string;
  customer_tax_ids: any[];
  default_payment_method: any;
  default_source: any;
  default_tax_rates: any[];
  description: any;
  discount: any;
  discounts: any[];
  due_date: any;
  effective_at: number;
  ending_balance: number;
  footer: any;
  from_invoice: any;
  hosted_invoice_url: string;
  id: string;
  invoice_pdf: string;
  issuer: Issuer;
  last_finalization_error: any;
  latest_revision: any;
  lines: Lines;
  livemode: boolean;
  metadata: Metadata4;
  next_payment_attempt: any;
  number: string;
  object: string;
  on_behalf_of: any;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent: string;
  payment_settings: PaymentSettings;
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  quote: any;
  receipt_number: any;
  rendering: any;
  rendering_options: any;
  shipping_cost: any;
  shipping_details: any;
  starting_balance: number;
  statement_descriptor: any;
  status: string;
  status_transitions: StatusTransitions;
  subscription: string;
  subscription_details: SubscriptionDetails;
  subtotal: number;
  subtotal_excluding_tax: number;
  tax: any;
  test_clock: any;
  total: number;
  total_discount_amounts: any[];
  total_excluding_tax: number;
  total_tax_amounts: any[];
  transfer_data: any;
  webhooks_delivered_at: number;
};

type AutomaticTax = {
  enabled: boolean;
  liability: any;
  status: any;
};

type CustomerAddress = {
  city: any;
  country: string;
  line1: any;
  line2: any;
  postal_code: any;
  state: any;
};

type Issuer = {
  type: string;
};

type Lines = {
  data: Daum2[];
  has_more: boolean;
  object: string;
  total_count: number;
  url: string;
};

type Daum2 = {
  amount: number;
  amount_excluding_tax: number;
  currency: string;
  description: string;
  discount_amounts: any[];
  discountable: boolean;
  discounts: any[];
  id: string;
  invoice: string;
  livemode: boolean;
  metadata: Metadata;
  object: string;
  period: Period;
  plan: Plan;
  price: Price;
  proration: boolean;
  proration_details: ProrationDetails;
  quantity: number;
  subscription: string;
  subscription_item: string;
  tax_amounts: any[];
  tax_rates: any[];
  type: string;
  unit_amount_excluding_tax: string;
};

type Metadata = {};

type Period = {
  end: number;
  start: number;
};

type Plan = {
  active: boolean;
  aggregate_usage: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  id: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Metadata2;
  meter: any;
  nickname: any;
  object: string;
  product: string;
  tiers_mode: any;
  transform_usage: any;
  trial_period_days: any;
  usage_type: string;
};

type Metadata2 = {};

type Price = {
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: any;
  id: string;
  livemode: boolean;
  lookup_key: any;
  metadata: Metadata3;
  nickname: any;
  object: string;
  product: string;
  recurring: Recurring;
  tax_behavior: string;
  tiers_mode: any;
  transform_quantity: any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
};

type Metadata3 = {};

type Recurring = {
  aggregate_usage: any;
  interval: string;
  interval_count: number;
  meter: any;
  trial_period_days: any;
  usage_type: string;
};

type ProrationDetails = {
  credited_items: any;
};

type Metadata4 = {};

type PaymentSettings = {
  default_mandate: any;
  payment_method_options: any;
  payment_method_types: any;
};

type StatusTransitions = {
  finalized_at: number;
  marked_uncollectible_at: any;
  paid_at: number;
  voided_at: any;
};

type SubscriptionDetails = {
  metadata: Metadata5;
};

type Metadata5 = {};

export const list = action({
  args: {
    subscription_id: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (_, { subscription_id, limit = 10 }) => {
    const response = await fetch(
      `https://api.stripe.com/v1/invoices?${new URLSearchParams({
        limit: limit.toString(),
        subscription: subscription_id,
      }).toString()}`,
      {
        headers: {
          Authorization: "Basic " + btoa(`${process.env.STRIPE_SECRET_KEY}:`),
        },
      },
    );

    const body = (await response.json()) as InvoicesList;
    return body;
  },
});
