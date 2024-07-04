"use node";
import { ConvexError, v } from "convex/values";
import nodemailer from "nodemailer";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const email = action({
  args: {
    template: v.id("emails"),
    to: v.string(),
  },
  handler: async (ctx, { to, template }) => {
    const email = await ctx.runQuery(internal.emails.getInternal, {
      id: template,
    });
    if (!email) {
      throw new ConvexError("Email template not found, aborting.");
    }

    const { html: storageId } = email;
    if (!storageId) {
      throw new ConvexError("Email template is missing HTML, aborting.");
    }

    const blob = await ctx.storage.get(storageId);
    if (!blob) {
      throw new ConvexError("Failed to get html from storage, aborting.");
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
