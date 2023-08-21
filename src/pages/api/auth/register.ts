import { NextApiHandler } from "next";
import { setCookie } from "nookies";

import { Surreal } from "surrealdb.js";
import { User } from "lib/types";
import { surreal } from "lib/surreal";
import { ACCESS_TOKEN_ID } from "lib/constants";
import { credentials, user } from "lib/schema/auth";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { username, password, email, workspace } = credentials
      .partial({ username: true, workspace: true })
      .parse(req.body);

    const token = await surreal.signup({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      workspace,
      username,
      password,
      email,
    });

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
    res.status(500);
  }

  res.end();
};

export default handler;
