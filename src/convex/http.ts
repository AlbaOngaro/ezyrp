import { httpRouter } from "convex/server";
import { webhook as stripeWebhook } from "./stripe/webhooks";
import { webhook as clerkWebhook } from "./clerk/webhooks";

const http = httpRouter();

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;
