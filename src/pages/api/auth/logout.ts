import { ACCESS_TOKEN_ID } from "lib/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  destroyCookie({ res }, ACCESS_TOKEN_ID, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });
  res.end();
}
