import { ConvexError } from "convex/values";
import { TableNamesInDataModel } from "convex/server";
import { internalMutation } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";

export const cleardb = internalMutation({
  handler: async (ctx) => {
    if (process.env.NODE_ENV !== "test") {
      throw new ConvexError("cleardb is only available in test mode");
    }

    const ENTITIES: TableNamesInDataModel<DataModel>[] = [
      "customers",
      "items",
      "events",
      "eventTypes",
      "workflows",
      "emails",
      "invoices",
    ];

    const allEntities = (
      await Promise.all(
        ENTITIES.map((entity) => ctx.db.query(entity).collect()),
      )
    ).flat();

    await Promise.all(allEntities.map((entity) => ctx.db.delete(entity._id)));
  },
});
