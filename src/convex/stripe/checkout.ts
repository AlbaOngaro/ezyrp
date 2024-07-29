import { v } from "convex/values";
import { action } from "../_generated/server";
import { plan } from "../schema";
import { PRICES, client } from "./constants";

export const setup = action({
  args: {
    customer: v.string(),
    subscription_id: v.string(),
  },
  handler: async (_, { customer, subscription_id }) => {
    return await client.checkout.sessions.create({
      success_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
      cancel_url: encodeURI(`${process.env.WEB_URL}/settings#billing`),
      customer,
      payment_method_types: ["card"],
      setup_intent_data: {
        metadata: {
          subscription_id,
        },
      },
      mode: "setup",
    });
  },
});

export const subscription = action({
  args: {
    plan,
    user_id: v.string(),
    workspace: v.string(),
    customer_email: v.string(),
    team_members: v.array(
      v.object({
        email: v.string(),
      }),
    ),
  },
  handler: async (
    _,
    { customer_email, workspace, user_id, team_members, plan },
  ) => {
    return await client.checkout.sessions.create({
      customer_email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICES[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL}/success`,
      cancel_url: `${process.env.WEB_URL}/onboarding`,
      mode: "subscription",
      metadata: {
        team_members: team_members.map((member) => member.email).join(","),
        workspace,
        user_id,
        plan,
      },
    });
  },
});
