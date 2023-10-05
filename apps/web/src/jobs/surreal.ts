import { SurrealTrigger } from "@nimblerp/surreal-trigger";
import { Invoice } from "__generated__/graphql";
import { Event } from "__generated__/server";

import { client } from "lib/trigger";

const surreal = new SurrealTrigger({
  id: "surreal",
  user: process.env.SURREAL_USER as string,
  pass: process.env.SURREAL_PASS as string,
  host: process.env.SURREAL_HOST as string,
});

client.defineJob({
  id: "event.created",
  name: "Event created trigger",
  version: "0.0.2",
  integrations: {
    surreal,
  },
  trigger: surreal.onRecordCreated<Event>({
    table: "event",
  }),
  run: async (payload, io, _ctx) => {
    await io.logger.log("onEventCreated");
    await io.logger.log("Payload", payload);
  },
});

client.defineJob({
  id: "invoice.created",
  name: "Invoice created trigger",
  version: "0.0.2",
  integrations: {
    surreal,
  },
  trigger: surreal.onRecordCreated<Invoice>({
    table: "invoice",
  }),
  run: async (payload, io, _ctx) => {
    await io.logger.log("onInvoiceCreated");
    await io.logger.log("Payload", payload);
  },
});
