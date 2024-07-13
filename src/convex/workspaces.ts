"use node";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { ConvexError, v } from "convex/values";

import { action } from "./_generated/server";
import { getAuthData } from "./utils";

const regex = /https:\/\/.*\|(.*)$/;

export const invite = action({
  args: {
    email: v.string(),
    role: v.union(v.literal("org:member"), v.literal("org:admin")),
  },
  handler: async (ctx, { email, role }) => {
    const { workspace, user_id } = await getAuthData(ctx);

    const match = regex.exec(user_id);
    if (!match || !match[1]) {
      throw new ConvexError("Invalid user id");
    }

    const inviterUserId = match[1];

    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: workspace,
      emailAddress: email,
      inviterUserId,
      role,
      redirectUrl: `${process.env.WEB_URL}/accept-invite`,
    });
  },
});
