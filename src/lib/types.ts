import { z } from "zod";

import { credentials, user } from "lib/schema/auth";
import { customer } from "lib/schema/customer";

export type Credentials = z.infer<typeof credentials>;

export type User = z.infer<typeof user>;

export type Customer = z.infer<typeof customer>;
