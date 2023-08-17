import { NextApiHandler } from "next";
import { setCookie } from "nookies";

import { Credentials, User } from "lib/types";
import { surreal } from "lib/surreal";
import { AUTH_COOKIE_ID } from "lib/constants";
import { Surreal } from "surrealdb.js";
import { z } from "zod";
import { credentials, user } from "lib/schema/auth";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { password, email } = credentials.parse(req.body);

    const token = await surreal.signin({
      NS: "test",
      DB: "test",
      SC: "allusers",
      email,
      password,
    });

    if (!token) {
      throw new Error("Something wrong, in the neighborhood");
    }

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
    res.status(401);
  }

  res.end();
};

export default handler;
