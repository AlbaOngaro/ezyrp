import { Surreal } from "surrealdb.js";
import { NextApiRequest, NextApiResponse } from "next";

import { surreal } from "server/surreal";
import { ACCESS_TOKEN_ID } from "lib/constants";
import { user } from "server/schema/auth";
import { User } from "lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies[ACCESS_TOKEN_ID];

  if (!token) {
    res.status(401).end();
    return;
  }

  try {
    await surreal.authenticate(token);
    const record = await (surreal as Surreal).info<User>();
    res.json(user.omit({ password: true }).parse(record));
  } catch (error: unknown) {
    console.error(error);
    res.status(401);
  }

  res.end();
}
