import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";

type Subscriptions = {
  object: string;
  url: string;
  has_more: boolean;
  data: Subscription[];
};

type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

type Subscription = {
  id: string;
  object: string;
  application: any;
  application_fee_percent: any;
  automatic_tax: AutomaticTax;
  billing_cycle_anchor: number;
  billing_thresholds: any;
  cancel_at: any;
  cancel_at_period_end: boolean;
  canceled_at: any;
  cancellation_details: CancellationDetails;
  collection_method: string;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: any;
  default_payment_method: any;
  default_source: any;
  default_tax_rates: any[];
  description: any;
  discount: any;
  discounts: any;
  ended_at: any;
  invoice_settings: InvoiceSettings;
  items: Items;
  latest_invoice: string;
  livemode: boolean;
  metadata: Metadata4;
  next_pending_invoice_item_invoice: any;
  on_behalf_of: any;
  pause_collection: any;
  payment_settings: PaymentSettings;
  pending_invoice_item_interval: any;
  pending_setup_intent: any;
  pending_update: any;
  schedule: any;
  start_date: number;
  status: SubscriptionStatus;
  test_clock: any;
  transfer_data: any;
  trial_end: any;
  trial_settings: TrialSettings;
  trial_start: any;
};

type AutomaticTax = {};

type InvoiceSettings = {};

type CancellationDetails = {
  comment: any;
  feedback: any;
  reason: any;
};

type Items = {
  object: string;
  data: Daum2[];
  has_more: boolean;
  total_count: number;
  url: string;
};

type Metadata = {};

type Daum2 = {
  id: string;
  object: string;
  billing_thresholds: any;
  created: number;
  metadata: Metadata;
  plan: Plan;
  price: Price;
  quantity: number;
  subscription: string;
  tax_rates: any[];
};

type Plan = {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  discounts: any;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Metadata2;
  nickname: any;
  product: string;
  tiers_mode: any;
  transform_usage: any;
  trial_period_days: any;
  usage_type: string;
};

type Metadata2 = {};

type Price = {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: any;
  livemode: boolean;
  lookup_key: any;
  metadata: Metadata3;
  nickname: any;
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
  trial_period_days: any;
  usage_type: string;
};

type Metadata4 = {};

type PaymentSettings = {
  payment_method_options: any;
  payment_method_types: any;
  save_default_payment_method: string;
};

type TrialSettings = {
  end_behavior: EndBehavior;
};

type EndBehavior = {
  missing_payment_method: string;
};

const headers = {
  Authorization: "Basic " + btoa(`${process.env.STRIPE_SECRET_KEY}:`),
};

export const list = action({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to view your subscriptions");
    }

    const email = identity.email;
    if (!email) {
      throw new ConvexError(
        "You must have an email to view your subscriptions",
      );
    }

    const customer = await ctx.runAction(internal.stripe.customers.search, {
      email,
    });

    if (!customer) {
      throw new ConvexError("No customer found for this email");
    }

    const response = await fetch(
      `https://api.stripe.com/v1/subscriptions?${new URLSearchParams({
        customer: customer.id,
        status: "all",
      }).toString()}`,
      {
        headers,
      },
    );
    const body = (await response.json()) as Subscriptions;
    return body;
  },
});

export const cancel = action({
  args: {
    subscription_id: v.string(),
  },
  handler: async (_, { subscription_id }) => {
    return fetch(`https://api.stripe.com/v1/subscriptions/${subscription_id}`, {
      method: "DELETE",
      headers,
    });
  },
});

export const resume = action({
  args: {
    subscription_id: v.string(),
  },
  handler: async (_, { subscription_id }) => {
    const response = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscription_id}/resume`,
      {
        method: "POST",
        headers,
        body: new URLSearchParams({
          billing_cycle_anchor: "now",
        }),
      },
    );

    const body = await response.json();

    console.log(body);

    return body;
  },
});
