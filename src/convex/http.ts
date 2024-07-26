import { httpRouter } from "convex/server";
import { webhook } from "./stripe/webhooks";

const http = httpRouter();

http.route({
  path: "/webhook",
  method: "POST",
  handler: webhook,
});

export default http;
