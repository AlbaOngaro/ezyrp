import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { ACCESS_TOKEN_ID } from "lib/constants";
import { invoice } from "lib/schema/invoice";

import { InvoicesService } from "services/invoices";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const invoicesService = new InvoicesService(
    req.cookies[ACCESS_TOKEN_ID] as string,
  );

  switch (req.method) {
    case "POST": {
      try {
        const customers = z.array(invoice.omit({ id: true })).parse(req.body);
        const record = await invoicesService.create(customers);
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
        const invoice = await invoicesService.read(id);

        if (invoice) {
          res.json(invoice);
          break;
        }

        res.status(404).end();
        break;
      }

      const customers = await invoicesService.list();
      res.json(customers);
      break;
    }
    case "PATCH": {
      try {
        const invoices = z
          .array(invoice.partial({ description: true }))
          .parse(req.body);
        const record = await invoicesService.update(invoices);
        res.json(record);
      } catch (error: unknown) {
        console.error(error);
        res.status(400).end();
      }
      break;
    }
    case "DELETE": {
      const ids = z.array(z.string()).parse(req.body);
      await invoicesService.delete(ids);
      res.status(204).end();
      break;
    }
    default:
      res.status(405).end();
      break;
  }
}
