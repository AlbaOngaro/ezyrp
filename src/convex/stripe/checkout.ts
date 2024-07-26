import { v } from "convex/values";
import { action } from "../_generated/server";
import { client } from "./client";

export const setup = action({
  args: {
    customer: v.string(),
    subscription_id: v.string(),
  },
  handler: async (_, { customer, subscription_id }) => {
    return await client.checkout.sessions.create({
      success_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
      cancel_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
      customer,
      payment_method_types: ["card"],
      setup_intent_data: {
        metadata: {
          subscription_id,
        },
      },
      mode: "setup",
    });
  },
});

const PRICES = {
  free: "price_1PgZ6JFCTTTwOs5UzuyteYDt",
  pro: "price_1Pg3fnFCTTTwOs5UnjddiMkg",
};

export const subscription = action({
  args: {
    user_id: v.string(),
    workspace: v.string(),
    customer_email: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (_, { customer_email, workspace, user_id, plan }) => {
    return await client.checkout.sessions.create({
      customer_email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL}/success`,
      cancel_url: `${process.env.WEB_URL}/onboarding`,
      mode: "subscription",
      metadata: {
        workspace,
        user_id,
      },
    });
  },
});
