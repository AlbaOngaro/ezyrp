import { v } from "convex/values";
import { action } from "../_generated/server";
import { client } from "./client";

export const list = action({
  args: {
    subscription_id: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (_, { subscription_id, limit = 10 }) => {
    return await client.invoices.list({
      limit,
      subscription: subscription_id,
    });
  },
});
