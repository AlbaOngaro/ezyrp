"use node";
import { ConvexError, v } from "convex/values";
import nodemailer from "nodemailer";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

type EmailReturnType = {
  to: string;
  html: string;
  from: string;
  subject: string;
};

export const email = action({
  args: {
    template: v.id("emails"),
    to: v.string(),
  },
  handler: async (ctx, { to, template }): Promise<EmailReturnType | void> => {
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

    if (process.env.NODE_ENV === "test") {
      console.warn("Email not sent in test environment");

      return {
        to,
        html,
        from: "info@nimblerp.com",
        subject: "New invoice",
      };
    }

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

export const sms = action({
  args: {
    to: v.string(),
    message: v.string(),
  },
  handler: async (_, { to, message }) => {
    console.log(`Sending SMS to ${to}: ${message}`);
  },
});
