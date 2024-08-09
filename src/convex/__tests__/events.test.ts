import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Events", () => {
  test("User can only get events in his workspace", async () => {
    const user1 = await t.mutation(internal.users.upsert, {
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

    const user2 = await t.mutation(internal.users.upsert, {
      clerk_id: "userid2",
      workspace: "workspace2",
      roles: ["org:admin"],
      plan: "pro",
    });
    const tAuth2 = t.withIdentity({
      tokenIdentifier: "https://testingasdf|userid2",
      // @ts-ignore
      websiteUrl: "workspace2",
      gender: "org:admin",
    });

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();

    const event_type_1 = await tAuth1.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 1",
      clerk_id: "userid1",
      duration: 30,
    });

    const workspace_1_event_1 = await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_1,
      status: "approved",
    });
    expect(workspace_1_event_1?._id).toBeDefined();
    await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      type: event_type_1,
      guests: [],
      status: "approved",
    });

    const event_type_2 = await tAuth2.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 2",
      clerk_id: "userid2",
      duration: 30,
    });
    const workspace_2_event_1 = await tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_2,
      status: "approved",
    });
    expect(workspace_2_event_1?._id).toBeDefined();
    tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_2,
      status: "approved",
    });

    const workspace_1_emails = await tAuth1.query(api.events.list, {});
    expect(workspace_1_emails.length).toBe(2);
    expect(
      workspace_1_emails.every((email) => email.workspace === "workspace1"),
    ).toBe(true);

    const workspace_2_emails = await tAuth2.query(api.events.list, {});
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

  test("Admin can get all events, Member can only get his", async () => {
    const user1 = await t.mutation(internal.users.upsert, {
      clerk_id: "userid1",
      workspace: "workspace1",
      plan: "pro",
      roles: ["org:admin"],
    });

    const user2 = await t.mutation(internal.users.upsert, {
      clerk_id: "userid2",
      workspace: "workspace1",
      plan: "pro",
      roles: ["org:member"],
    });

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();

    const admin = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
      tokenIdentifier: "https://testingasdf|userid1",
    });

    const member = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:member",
      tokenIdentifier: "https://testingasdf|userid2",
    });

    const event_type_1 = await admin.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 1",
      clerk_id: "userid2",
      duration: 30,
    });

    await admin.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_1,
      status: "approved",
    });

    await admin.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_1,
      status: "approved",
    });

    const event_type_2 = await member.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 2",
      clerk_id: "userid1",
      duration: 30,
    });

    await member.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      type: event_type_2,
      status: "approved",
    });

    const adminEvents = await admin.query(api.events.search, {
      paginationOpts: {
        cursor: null,
        numItems: 5,
      },
    });
    expect(adminEvents.page.length).toBe(3);

    const memberEvents = await member.query(api.events.search, {
      paginationOpts: {
        cursor: null,
        numItems: 5,
      },
    });
    expect(memberEvents.page.length).toBe(1);
  });
});
