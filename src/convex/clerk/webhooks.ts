import { Webhook } from "svix";
import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { WebhookPayload } from "./types";

const endpointSecret = process.env.CLERK_WEBHOOK_SECRET as string;

const wh = new Webhook(endpointSecret);

export const webhook = httpAction(async (ctx, request) => {
  const headers: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const body = await request.text();

  const payload = wh.verify(body, headers) as WebhookPayload;

  switch (payload.type) {
    case "organizationMembership.updated": {
      console.log("Organization membership updated event received");

      const { data } = payload;

      await ctx.runMutation(internal.users.upsert, {
        clerk_id: data.public_user_data.user_id,
        workspace: data.organization.id,
        roles: [data.role],
        plan: data.organization.public_metadata.plan,
      });

      return new Response(null, {
        status: 200,
      });
    }
    case "organizationMembership.created": {
      console.log("Organization membership created event received");

      const { data } = payload;

      await ctx.runMutation(internal.users.upsert, {
        clerk_id: data.public_user_data.user_id,
        workspace: data.organization.id,
        roles: [data.role],
        plan: data.organization.public_metadata.plan,
      });

      return new Response(null, {
        status: 200,
      });
    }
    case "organizationMembership.deleted": {
      console.log("Organization membership deleted event received");

      await ctx.runMutation(internal.users.remove, {
        clerk_id: payload.data.public_user_data.user_id,
      });

      return new Response(null, {
        status: 200,
      });
    }
    case "organization.updated": {
      console.log("Organization updated event received");

      const { data } = payload;

      const users = await ctx.runQuery(internal.users.list, {
        workspace: data.id,
      });

      for (const user of users) {
        await ctx.runMutation(internal.users.upsert, {
          clerk_id: user.clerk_id,
          workspace: data.id,
          roles: user.roles,
          plan: data.public_metadata.plan,
        });
      }

      return new Response(null, {
        status: 200,
      });
    }
    default: {
      console.log("Unknown event type received");
      return new Response(null, {
        status: 200,
      });
    }
  }
});
