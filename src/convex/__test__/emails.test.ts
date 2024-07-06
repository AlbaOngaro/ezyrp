import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { t } from "./__mocks__/convex";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Emails", () => {
  test("User can only get emails in his workspace", async () => {
    const tAuth1 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
    });

    const w1e1 = await tAuth1.mutation(api.emails.create, {
      title: "Template 1",
    });
    await tAuth1.mutation(api.emails.create, {
      title: "Template 1",
    });

    const tAuth2 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace2",
    });

    const w2e1 = await tAuth2.mutation(api.emails.create, {
      title: "Template 1",
    });
    tAuth2.mutation(api.emails.create, { title: "Template 1" });

    const emails1 = await tAuth1.query(api.emails.list);
    expect(emails1.length).toBe(2);
    expect(emails1.every((email) => email.workspace === "workspace1")).toBe(
      true,
    );

    const emails2 = await tAuth2.query(api.emails.list);
    expect(emails2.length).toBe(2);
    expect(emails2.every((email) => email.workspace === "workspace2")).toBe(
      true,
    );

    try {
      await tAuth1.query(api.emails.get, { id: w2e1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await tAuth2.query(api.emails.get, { id: w1e1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.emails.get, { id: w1e1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.emails.get, { id: w2e1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  test("Deleting email disables related workflows", async () => {
    const tAuth = t.withIdentity({
      // @ts-ignore
      websiteUrl: "test",
    });

    const email_id = await tAuth.mutation(api.emails.create, { title: "Test" });
    const workflow_id = await tAuth.mutation(api.workflows.create, {
      title: "Test",
    });
    await tAuth.mutation(api.workflows.update, {
      id: workflow_id,
      status: "active",
      settings: {
        event: "customer:created",
        action: "email",
        template: email_id,
      },
    });
    const active_workflows = await tAuth.query(api.workflows.get, {
      id: workflow_id,
    });
    expect(active_workflows.status).toBe("active");

    await tAuth.mutation(api.emails.remove, { id: email_id });
    const inactive_workflows = await tAuth.query(api.workflows.get, {
      id: workflow_id,
    });
    expect(inactive_workflows.status).toBe("inactive");
  });
});
