import { z } from "zod";

import { credentials, user } from "server/schema/auth";
import { customer } from "server/schema/customer";
import { invoice } from "server/schema/invoice";
import { profile } from "server/schema/profile";

import { createEventInput, event } from "server/schema/event";

export type Credentials = z.infer<typeof credentials>;

export type User = z.infer<typeof user>;

export type Customer = z.infer<typeof customer>;

export type Invoice = z.infer<typeof invoice>;

export type Profile = z.infer<typeof profile>;

export type Event = z.infer<typeof event>;

export type CreateEventInput = z.infer<typeof createEventInput>;

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<
      string,
      {
        common: string;
        official: string;
      }
    >;
  };
}
