import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Workflows", () => {
  test("Only pro users can access workflows", async () => {
    await t.mutation(internal.users.upsert, {
      clerk_id: "userid1",
      workspace: "workspace1",
      roles: ["org:admin"],
      plan: "pro",
    });

    const tAuth1 = t.withIdentity({
      tokenIdentifier: "https://testingasdf|userid1",
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
    });

    try {
      await tAuth1.mutation(api.workflows.create, {
        title: "Template 1",
      });
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(false);
    }

    try {
      await tAuth1.query(api.workflows.search, {
        paginationOpts: {
          numItems: 10,
          cursor: null,
        },
      });
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(false);
    }

    await t.mutation(internal.users.upsert, {
      clerk_id: "userid2",
      workspace: "workspace2",
      roles: ["org:admin"],
      plan: "free",
    });

    const tAuth2 = t.withIdentity({
      tokenIdentifier: "https://testingasdf|userid2",
      // @ts-ignore
      websiteUrl: "workspace2",
      gender: "org:admin",
    });

    try {
      await tAuth2.mutation(api.workflows.create, {
        title: "Template 1",
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await tAuth2.query(api.workflows.search, {
        paginationOpts: {
          numItems: 10,
          cursor: null,
        },
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
