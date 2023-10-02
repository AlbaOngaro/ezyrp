import { NextApiRequest, NextApiResponse } from "next";
import webpush, { PushSubscription } from "web-push";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const subscription = req.body.subscription;

  if (!subscription) {
    res.status(400).end();
    return;
  }

  webpush.setVapidDetails(
    "mailto:alba.ongaro@outlook.com",
    process.env.PUSH_PUBLIC_KEY as string,
    process.env.PUSH_SECRET_KEY as string,
  );

  const result = await webpush.sendNotification(
    req.body.subscription as PushSubscription,
    JSON.stringify(req.body.message),
  );

  res.send(result);
}
