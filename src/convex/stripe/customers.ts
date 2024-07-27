import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { client } from "./constants";

export const search = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (_, { email }) => {
    return await client.customers.search({
      query: `email~"${email}"`,
    });
  },
});
