import { v } from "convex/values";
import { action } from "./_generated/server";

export const email = action({
  args: {
    to: v.string(),
  },
  handler: async (ctx, { to }) => {
    console.log(`Sending email to ${to}`);
  },
});
