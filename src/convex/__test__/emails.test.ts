import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "./test.setup";

test("Deleting email disables workflows", async () => {
  const t = convexTest(schema, modules);
  // @ts-ignore
  const tAuth = t.withIdentity({ websiteUrl: "test" });

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
