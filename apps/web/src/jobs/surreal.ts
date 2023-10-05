import { SurrealTrigger } from "@nimblerp/surreal-trigger";
import { z } from "zod";

import { client } from "lib/trigger";

import { inputCreateInvoiceArgs } from "server/schema/invoice";
import { createEventInput } from "server/schema/event";

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
  trigger: surreal.onRecordCreated<z.infer<typeof createEventInput>>({
    table: "event",
  }),
  run: async (_payload, _io, _ctx) => {},
});

client.defineJob({
  id: "invoice.created",
  name: "Invoice created trigger",
  version: "0.0.2",
  integrations: {
    surreal,
  },
  trigger: surreal.onRecordCreated<z.infer<typeof inputCreateInvoiceArgs>>({
    table: "invoice",
  }),
  run: async (payload, _io, _ctx) => {
    payload.after.customer;
  },
});
