import { z } from "zod";

import { credentials, user } from "lib/schema/auth";

export type Credentials = z.infer<typeof credentials>;

export type User = z.infer<typeof user>;