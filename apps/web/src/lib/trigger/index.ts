import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "nimblerp-U2q0",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
