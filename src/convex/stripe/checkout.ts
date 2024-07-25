import { v } from "convex/values";
import { action } from "../_generated/server";

type Session = {
  after_expiration: any;
  allow_promotion_codes: any;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: AutomaticTax;
  billing_address_collection: any;
  cancel_url: any;
  client_reference_id: any;
  client_secret: any;
  consent: any;
  consent_collection: any;
  created: number;
  currency: string;
  currency_conversion: any;
  custom_fields: any[];
  custom_text: CustomText;
  customer: any;
  customer_creation: string;
  customer_details: any;
  customer_email: any;
  expires_at: number;
  id: string;
  invoice: any;
  invoice_creation: any;
  livemode: boolean;
  locale: any;
  metadata: Metadata;
  mode: string;
  object: string;
  payment_intent: any;
  payment_link: any;
  payment_method_collection: string;
  payment_method_configuration_details: any;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: PhoneNumberCollection;
  recovered_from: any;
  saved_payment_method_options: SavedPaymentMethodOptions;
  setup_intent: any;
  shipping: any;
  shipping_address_collection: any;
  shipping_options: any[];
  shipping_rate: any;
  status: string;
  submit_type: any;
  subscription: any;
  success_url: string;
  total_details: TotalDetails;
  ui_mode: string;
  url: string;
};

type AutomaticTax = {
  enabled: boolean;
  liability: any;
  status: any;
};

type CustomText = {
  after_submit: any;
  shipping_address: any;
  submit: any;
  terms_of_service_acceptance: any;
};

type Metadata = {};

type PaymentMethodOptions = {
  card: Card;
};

type Card = {
  request_three_d_secure: string;
};

type PhoneNumberCollection = {
  enabled: boolean;
};

type SavedPaymentMethodOptions = {
  allow_redisplay_filters: string[];
  payment_method_remove: any;
  payment_method_save: any;
};

type TotalDetails = {
  amount_discount: number;
  amount_shipping: number;
  amount_tax: number;
};

export const session = action({
  args: {
    customer: v.string(),
    subscription_id: v.string(),
  },
  handler: async (_, { customer, subscription_id }): Promise<Session> => {
    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${process.env.STRIPE_SECRET_KEY}:`),
        },
        body: new URLSearchParams({
          success_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
          cancel_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
          customer,
          "payment_method_types[]": "card",
          "setup_intent_data[metadata][subscription_id]": subscription_id,
          mode: "setup",
        }).toString(),
      },
    );
    const body = await response.json();
    return body;
  },
});
