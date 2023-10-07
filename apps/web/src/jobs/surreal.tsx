import { z } from "zod";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { SurrealTrigger } from "@nimblerp/surreal-trigger";
import { Invite, NewInvoice } from "@nimblerp/emails";
import webpush, { PushSubscription } from "web-push";

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
  integrations: {
    surreal,
  },
  enabled: true,
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
  enabled: true,
  trigger: surreal.onRecordCreated<z.infer<typeof inputCreateInvoiceArgs>>({
    table: "invoice",
  }),
  run: async ({ after: { id, due, emitted, items } }, io) => {
    try {
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
      const text = render(<NewInvoice id={id} due={due} emitted={emitted} />, {
        plainText: true,
      });

      await transporter.sendMail({
        from: "info@nimblerp.com",
        to: "dolcebunny15@gmail.com",
        subject: "New invoice",
        html,
        text,
      });
    } catch (error: unknown) {
      console.error(error);
    }

    await io.surreal.runTask("update", async (client) => {
      await client.query(
        [
          "BEGIN TRANSACTION",
          ...items.map(
            (item) =>
              `UPDATE ${item} SET quantity -= IF quantity > 0 THEN 1 ELSE 0 END;`,
          ),
          "COMMIT TRANSACTION",
        ].join(";"),
      );
    });
  },
});

client.defineJob({
  id: "item.updated",
  name: "Item updated trigger",
  version: "0.0.1",
  integrations: {
    surreal,
  },
  enabled: true,
  trigger: surreal.onRecordUpdated<z.infer<typeof item>>({
    table: "item",
  }),
  run: async ({ after: { quantity, id } }, io) => {
    if (quantity === 0) {
      await io.surreal.runTask("subscriptions", async (client) => {
        const [, { result: subscription }] = await client.query<
          // @ts-ignore
          [null, PushSubscription[]]
        >(
          `
            LET $workspace = SELECT workspace FROM ${id};
            SELECT endpoint, keys, expirationTime, user[WHERE workspace = type::string($workspace)] FROM subscription;
          `,
        );

        if (subscription && subscription[0]) {
          webpush.setVapidDetails(
            "mailto:alba.ongaro@outlook.com",
            process.env.PUSH_PUBLIC_KEY as string,
            process.env.PUSH_SECRET_KEY as string,
          );

          const response = await webpush.sendNotification(
            subscription[0],
            JSON.stringify({
              title: "You finished an item!",
            }),
          );

          await io.logger.info("Response ", response);
        }
      });
    }
  },
});

const inviteData = z.object({
  id: z.string(),
  email: z.string().email(),
  workspace: z.string(),
  sent_at: z.string().nullable(),
});

type InviteData = z.infer<typeof inviteData>;

client.defineJob({
  id: "invite.updated",
  name: "Invite updated trigger",
  version: "0.0.2",
  integrations: {
    surreal,
  },
  enabled: true,
  trigger: surreal.onRecordUpdated<InviteData>({
    table: "invite",
  }),
  run: async ({ before: { sent_at }, after: { email, id, workspace } }, io) => {
    if (!sent_at) {
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

      const html = render(
        <Invite invitee={email} inviter="Alba Ongaro" workspace={workspace} />,
      );

      const text = render(
        <Invite invitee={email} inviter="Alba Ongaro" workspace={workspace} />,
        {
          plainText: true,
        },
      );

      await transporter.sendMail({
        from: "info@nimblerp.com",
        to: email,
        subject: "Workspace invite",
        html,
        text,
      });

      await io.surreal.runTask("invite.sent", async (client) => {
        await client.merge(id, {
          sent_at: new Date().toISOString(),
        });
      });
    }
  },
});
