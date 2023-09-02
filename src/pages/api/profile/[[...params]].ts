import { NextApiRequest, NextApiResponse } from "next";

import { ACCESS_TOKEN_ID } from "lib/constants";

import { ProfileService } from "server/services/profile";
import { profile } from "server/schema/profile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const profileService = new ProfileService(
    req.cookies[ACCESS_TOKEN_ID] as string,
  );

  switch (req.method) {
    case "GET": {
      const profile = await profileService.read();
      res.json(profile);
      break;
    }
    case "PATCH": {
      try {
        const data = profile
          .omit({ user: true })
          .partial({
            address: true,
            city: true,
            code: true,
            country: true,
          })
          .parse(req.body);
        await profileService.update(data);
        res.status(204).end();
      } catch (error: unknown) {
        console.error(error);
        res.status(400).end();
      }

      break;
    }
    default:
      res.status(405).end();
      break;
  }
}
