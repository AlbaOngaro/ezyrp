import { NextApiHandler } from "next";
import { setCookie } from "nookies";

import { User } from "lib/types";
import { surreal } from "lib/surreal";
import { AUTH_COOKIE_ID } from "lib/constants";
import { Surreal } from "surrealdb.js";
import { credentials, user } from "lib/schema/auth";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { username, password, email } = credentials.parse(req.body);

    const token = await surreal.signup({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      username,
      password,
      email,
    });

    setCookie({ res }, AUTH_COOKIE_ID, token, {
      secure: true,
      sameSite: true,
      httpOnly: true,
      path: "/",
    });

    const record = await (surreal as Surreal).info<User>();
    res.json(user.omit({ password: true }).parse(record));
  } catch (error: unknown) {
    console.error(error);
    res.status(500);
  }

  res.end();
};

export default handler;
