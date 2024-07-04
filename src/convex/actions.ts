"use node";
import { v } from "convex/values";
import nodemailer from "nodemailer";

import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const email = action({
  args: {
    template: v.id("emails"),
    to: v.string(),
  },
  handler: async (ctx, { to, template }) => {
    const { html: storageId } = await ctx.runQuery(api.emails.get, {
      id: template,
    });
    if (!storageId) {
      return null;
    }

    const blob = await ctx.storage.get(storageId);
    if (!blob) {
      return null;
    }

    const html = await blob.text();

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

      await transporter.sendMail({
        to,
        html,
        from: "info@nimblerp.com",
        subject: "New invoice",
      });
    } catch (error: unknown) {
      console.error(error);
    }
  },
});
