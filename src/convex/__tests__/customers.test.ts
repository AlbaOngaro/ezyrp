import { describe, expect, test } from "vitest";

import { api } from "../_generated/api";
import { t } from "./__mocks__/convex.mock";

describe("Customers", () => {
  test("User can only get customers in his workspace", async () => {
    const tAuth1 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
    });

    const workspace_1_customer_1 = await tAuth1.mutation(api.customers.create, {
      name: "Customer 1",
      email: "customer_1@workspace1.test",
    });
    await tAuth1.mutation(api.customers.create, {
      name: "Customer 1",
      email: "customer_2@workspace1.test",
    });

    const workspace_1_customers = await tAuth1.query(api.customers.list);
    expect(workspace_1_customers.length).toBe(2);
    expect(
      workspace_1_customers.every((email) => email.workspace === "workspace1"),
    ).toBe(true);

    const tAuth2 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace2",
    });

    const workspace_2_customer_1 = await tAuth2.mutation(api.customers.create, {
      name: "Customer 1",
      email: "customer_1@workspace2.test",
    });
    tAuth2.mutation(api.customers.create, {
      name: "Customer 2",
      email: "customer_2@workspace2.test",
    });

    const workspace_2_customers = await tAuth2.query(api.customers.list);
    expect(workspace_2_customers.length).toBe(2);
    expect(
      workspace_2_customers.every((email) => email.workspace === "workspace2"),
    ).toBe(true);

    try {
      await tAuth1.query(api.customers.get, { id: workspace_2_customer_1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await tAuth2.query(api.customers.get, { id: workspace_1_customer_1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.customers.get, { id: workspace_1_customer_1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.customers.get, { id: workspace_2_customer_1 });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
