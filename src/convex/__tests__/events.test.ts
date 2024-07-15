import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

describe("Events", () => {
  test("User can only get events in his workspace", async () => {
    const tAuth1 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
    });

    const event_type_1 = await tAuth1.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 1",
      user_id: "user1",
      duration: 30,
    });

    const workspace_1_event_1 = await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "",
      type: event_type_1,
      status: "approved",
    });
    expect(workspace_1_event_1?._id).toBeDefined();
    await tAuth1.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      type: event_type_1,
      organizer: "",
      guests: [],
      status: "approved",
    });

    const tAuth2 = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace2",
      gender: "org:admin",
    });

    const event_type_2 = await tAuth2.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 2",
      user_id: "user1",
      duration: 30,
    });
    const workspace_2_event_1 = await tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "",
      type: event_type_2,
      status: "approved",
    });
    expect(workspace_2_event_1?._id).toBeDefined();
    tAuth2.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "",
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
    const admin = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
      tokenIdentifier: "user1",
    });

    const member = t.withIdentity({
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:member",
      tokenIdentifier: "user2",
    });

    const event_type_1 = await admin.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 1",
      user_id: "user1",
      duration: 30,
    });

    await admin.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "user1",
      type: event_type_1,
      status: "approved",
    });

    await admin.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "user1",
      type: event_type_1,
      status: "approved",
    });

    const event_type_2 = await member.mutation(api.eventTypes.create, {
      variant: "red",
      name: "Event Type 2",
      user_id: "user2",
      duration: 30,
    });

    await member.mutation(api.events.create, {
      start: "2021-01-01",
      end: "2021-01-02",
      guests: [],
      organizer: "user2",
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
