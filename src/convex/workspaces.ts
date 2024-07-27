"use node";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";

import { action } from "./_generated/server";
import { getAuthData } from "./utils";

export const invite = action({
  args: {
    email: v.string(),
    role: v.union(v.literal("org:member"), v.literal("org:admin")),
  },
  handler: async (ctx, { email, role }) => {
    const { workspace, clerk_id } = await getAuthData(ctx);

    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: workspace,
      emailAddress: email,
      inviterUserId: clerk_id,
      role,
      redirectUrl: `${process.env.WEB_URL}/accept-invite`,
    });
  },
});
