import Stripe from "stripe";

import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";

import { PRICES, client } from "./constants";

export const list = action({
  handler: async (ctx): Promise<Stripe.ApiListPromise<Stripe.Subscription>> => {
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

    const customers = await ctx.runAction(internal.stripe.customers.search, {
      email,
    });

    if (!customers || !customers.data || customers.data.length === 0) {
      throw new ConvexError("No customer found for this email");
    }

    const customer = customers.data[0];

    return await client.subscriptions.list({
      customer: customer.id,
      status: "all",
    });
  },
});

export const cancel = action({
  args: {
    subscription_id: v.string(),
  },
  handler: async (_, { subscription_id }) => {
    return await client.subscriptions.cancel(subscription_id);
  },
});

export const resume = action({
  args: {
    subscription_id: v.string(),
  },
  handler: async (_, { subscription_id }) => {
    return await client.subscriptions.resume(subscription_id);
  },
});

export const update = action({
  args: {
    subscription_id: v.string(),
    subscription_item_id: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (_, { subscription_id, subscription_item_id, plan }) => {
    return await client.subscriptions.update(subscription_id, {
      items: [
        {
          id: subscription_item_id,
          price: PRICES[plan],
        },
      ],
    });
  },
});
