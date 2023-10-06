import { z } from "zod";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { SurrealTrigger } from "@nimblerp/surreal-trigger";
import { NewInvoice } from "@nimblerp/emails";

import { client } from "lib/trigger";

import { inputCreateInvoiceArgs } from "server/schema/invoice";
import { createEventInput } from "server/schema/event";
import { item } from "server/schema/inventory";

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
  enabled: false,
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
  enabled: false,
  integrations: {
    surreal,
  },
  trigger: surreal.onRecordCreated<z.infer<typeof inputCreateInvoiceArgs>>({
    table: "invoice",
  }),
  run: async ({ after: { id, due, emitted } }) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const html = render(<NewInvoice id={id} due={due} emitted={emitted} />);

    await transporter.sendMail({
      from: "info@nimblerp.com",
      to: "dolcebunny15@gmail.com",
      subject: "New invoice",
      html,
    });
  },
});

client.defineJob({
  id: "item.updated",
  name: "Item updated trigger",
  version: "0.0.1",
  enabled: false,
  integrations: {
    surreal,
  },
  trigger: surreal.onRecordUpdated<z.infer<typeof item>>({
    table: "item",
  }),
  run: async (payload, io) => {
    await io.logger.info("Processing item", payload);
  },
});
