import { z } from "zod";

import { credentials, user } from "lib/schema/auth";
import { customer } from "lib/schema/customer";
import { invoice } from "lib/schema/invoice";
import { profile } from "lib/schema/profile";

import { createEventInput, event } from "lib/schema/event";

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
