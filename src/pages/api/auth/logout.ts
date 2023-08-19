import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";
import { ACCESS_TOKEN_ID } from "lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  destroyCookie({ res }, ACCESS_TOKEN_ID, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  const { redirect_to = "http://localhost:3000/login" } = req.query;

  res.redirect(redirect_to as string);
}
