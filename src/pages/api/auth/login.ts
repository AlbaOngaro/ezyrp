import { NextApiHandler } from "next";
import { setCookie } from "nookies";

import { Credentials, User } from "lib/types";
import { surreal } from "lib/surreal";
import { ACCESS_TOKEN_ID } from "lib/constants";
import { Surreal } from "surrealdb.js";
import { z } from "zod";
import { credentials, user } from "lib/schema/auth";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { password, email } = credentials
      .omit({ username: true })
      .parse(req.body);

    const token = await surreal.signin({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      email,
      password,
    });

    if (!token) {
      throw new Error("Something wrong, in the neighborhood");
    }

    setCookie({ res }, ACCESS_TOKEN_ID, token, {
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
