import { z } from "zod";

import { credentials, user } from "lib/schema/auth";
import { customer } from "lib/schema/customer";
import { invoice } from "lib/schema/invoice";

export type Credentials = z.infer<typeof credentials>;

export type User = z.infer<typeof user>;

export type Customer = z.infer<typeof customer>;

export type Invoice = z.infer<typeof invoice>;
