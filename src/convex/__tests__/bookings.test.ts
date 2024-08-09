import { afterEach, describe, expect, test } from "vitest";

import { api, internal } from "../_generated/api";
import { t } from "./__mocks__/convex.mock";

afterEach(async () => {
  await t.mutation(internal.tests.cleardb);
});

const DEFAULT_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const SLOTS = [
  DEFAULT_SLOTS,
  DEFAULT_SLOTS,
  DEFAULT_SLOTS,
  DEFAULT_SLOTS,
  DEFAULT_SLOTS,
  [],
  [],
];

describe("Bookings", () => {
  test("Correctly returns available slots", async () => {
    await t.mutation(internal.users.upsert, {
      clerk_id: "userid1",
      workspace: "workspace1",
      roles: ["org:admin"],
      plan: "pro",
    });

    const tAuth = t.withIdentity({
      tokenIdentifier: "https://testingasdf|userid1",
      // @ts-ignore
      websiteUrl: "workspace1",
      gender: "org:admin",
    });

    await tAuth.mutation(api.settings.upsert, {
      days: {
        monday: [{ start: "09:00", end: "17:00" }],
        tuesday: [{ start: "09:00", end: "17:00" }],
        wednesday: [{ start: "09:00", end: "17:00" }],
        thursday: [{ start: "09:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "17:00" }],
        saturday: [],
        sunday: [],
      },
    });

    const eventType = await tAuth.mutation(api.eventTypes.create, {
      name: "Meeting",
      duration: 60,
      variant: "red",
      clerk_id: "userid1",
    });

    for (let i = 0; i < 7; i++) {
      const start = new Date(2024, 7, 4 + i);
      const slots = await tAuth.query(api.bookings.slots, {
        id: eventType,
        day: start.getTime(),
      });

      expect(slots).toHaveLength(SLOTS[i].length);
      expect(slots).toEqual(SLOTS[i]);
    }
  });
});
