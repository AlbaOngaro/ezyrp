import { internalMutation } from "./_generated/server";

export const clear = internalMutation({
  handler: async (ctx) => {
    if (process.env.NODE_ENV !== "test") {
      return;
    }

    const customers = await ctx.db.query("customers").collect();
    for (const customer of customers) {
      console.log("Deleting customer", customer._id);
      await ctx.db.delete(customer._id);
    }
  },
});
