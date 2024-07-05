import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getValidUuid,
} from "./utils";

export const getInternal = internalQuery({
  args: {
    id: v.id("emails"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const get = query({
  args: {
    id: v.id("emails"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "emails",
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "emails");
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const { workspace } = await getAuthData(ctx);

    const sid = getValidUuid();
    const pid = getValidUuid();

    const id = await ctx.db.insert("emails", {
      title,
      workspace,
      body: [
        {
          id: sid,
          type: "section",
          contents: [
            {
              id: pid,
              type: "paragraph",
              style: {
                fontSize: "16px",
                lineHeight: "26px",
              },
              children: [{ text: "" }],
            },
          ],
          children: [{ text: "" }],
        },
      ],
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("emails"),
    title: v.optional(v.string()),
    body: v.optional(v.any()),
    html: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, title, body, html }) => {
    const email = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "emails",
    });

    await ctx.db.patch(email._id, {
      body: body || email.body,
      title: title || email.title,
      html: html || email.html,
    });

    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "emails",
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("emails"),
  },
  handler: async (ctx, { id }) => {
    const { workspace } = await getAuthData(ctx);
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "emails",
    });

    const workflows = await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) =>
        q.and(
          q.eq(q.field("settings.template"), id),
          q.eq(q.field("status"), "active"),
        ),
      )
      .collect();

    for (const workflow of workflows) {
      await ctx.db.patch(workflow._id, {
        status: "inactive",
      });
    }

    await ctx.db.delete(id);
  },
});
