import { clerkClient } from "@clerk/clerk-sdk-node";
import { httpAction } from "../_generated/server";
import { client } from "./constants";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const webhook = httpAction(async (ctx, request) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    console.error("No signature found in headers");
    return new Response("No signature", {
      status: 400,
    });
  }

  const body = await request.text();
  if (!body) {
    console.error("No body found in request");
    return new Response("No body", {
      status: 400,
    });
  }

  try {
    const event = await client.webhooks.constructEventAsync(
      body,
      sig,
      endpointSecret,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        if (event.data.object.mode === "subscription") {
          const plan = event.data.object.metadata?.plan;
          const user_id = event.data.object.metadata?.user_id;
          const workspace = event.data.object.metadata?.workspace;

          if (!workspace || !user_id || !plan) {
            console.error("Missing subscription metadata");
            return new Response(null, {
              status: 400,
            });
          }

          const user = await clerkClient.users.getUser(user_id);

          await clerkClient.organizations.createOrganization({
            name: workspace,
            createdBy: user.id,
            publicMetadata: {
              plan,
            },
          });

          console.log("Subscription purchased for", event.data.object.metadata);
        }

        return new Response(null, {
          status: 200,
        });
      }
      case "customer.subscription.updated": {
        const plan = event.data.object.metadata?.plan;
        const workspace = event.data.object.metadata?.workspace;

        if (!plan || !workspace) {
          console.error("Missing subscription metadata");
          return new Response(null, {
            status: 400,
          });
        }

        await clerkClient.organizations.updateOrganization(workspace, {
          publicMetadata: {
            plan,
          },
        });

        console.log("Subscription updated for", event.data.object.metadata);

        return new Response(null, {
          status: 200,
        });
      }
      default: {
        // Handle the event
        console.log(`Unhandled event type ${event.type}`);
        return new Response(null, {
          status: 404,
        });
      }
    }
  } catch (err) {
    console.error("Webhook Error", err);

    return new Response(`Webhook Error: ${err || ""}`, {
      status: 400,
    });
  }
});
