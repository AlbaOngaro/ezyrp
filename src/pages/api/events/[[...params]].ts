import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { ACCESS_TOKEN_ID } from "lib/constants";

import { EventsService } from "server/services/events";
import { event, createEventInput } from "server/schema/event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const eventsService = new EventsService(
    req.cookies[ACCESS_TOKEN_ID] as string,
  );

  switch (req.method) {
    case "POST": {
      try {
        const record = await eventsService.create(
          createEventInput.omit({ id: true }).parse(req.body),
        );
        res.status(201).json(record);
      } catch (error: unknown) {
        console.error(error);
        res.status(400).end();
      }
      break;
    }
    case "GET": {
      const params = req.query.params;

      if (params && params.length === 1) {
        const [id] = params;
        const invoice = await eventsService.read(id);

        if (invoice) {
          res.json(invoice);
          break;
        }

        res.status(404).end();
        break;
      }

      const customers = await eventsService.list();
      res.json(customers);
      break;
    }
    case "PATCH": {
      try {
        const events = z.array(event).parse(req.body);
        const record = await eventsService.update(events);
        res.json(record);
      } catch (error: unknown) {
        console.error(error);
        res.status(400).end();
      }
      break;
    }
    case "DELETE": {
      const ids = z.array(z.string()).parse(req.body);
      await eventsService.delete(ids);
      res.status(204).end();
      break;
    }
    default:
      res.status(405).end();
      break;
  }
}
