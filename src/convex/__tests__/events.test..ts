import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Events", () => {
  test("User can only get emails in his workspace", async () => {
    const tAuth1 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
    });

    const workspace_1_event_1 = await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      variant: "test",
      title: "Event 1",
      guests: [],
    });
    expect(workspace_1_event_1?._id).toBeDefined();
    await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      variant: "test",
      title: "Event 2",
      guests: [],
    });

    const tAuth2 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace2",
    });

    const workspace_2_event_1 = await tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      variant: "test",
      title: "Event 1",
      guests: [],
    });
    expect(workspace_2_event_1?._id).toBeDefined();
    tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      variant: "test",
      title: "Event 2",
      guests: [],
    });

    const workspace_1_emails = await tAuth1.query(api.events.list);
    expect(workspace_1_emails.length).toBe(2);
    expect(
      workspace_1_emails.every((email) => email.workspace === "workspace1"),
    ).toBe(true);

    const workspace_2_emails = await tAuth2.query(api.events.list);
    expect(workspace_2_emails.length).toBe(2);
    expect(
      workspace_2_emails.every((email) => email.workspace === "workspace2"),
    ).toBe(true);

    try {
      await tAuth1.query(api.events.get, {
        id: workspace_2_event_1?._id as Id<"events">,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await tAuth2.query(api.events.get, {
        id: workspace_1_event_1?._id as Id<"events">,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.events.get, {
        id: workspace_1_event_1?._id as Id<"events">,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }

    try {
      await t.query(api.events.get, {
        id: workspace_2_event_1?._id as Id<"events">,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
