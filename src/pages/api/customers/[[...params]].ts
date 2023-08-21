import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { ACCESS_TOKEN_ID } from "lib/constants";
import { customer } from "lib/schema/customer";

import { CustomersService } from "services/customers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const customersService = new CustomersService(
    req.cookies[ACCESS_TOKEN_ID] as string,
  );

  switch (req.method) {
    case "POST": {
      try {
        const customers = z
          .array(customer.omit({ id: true, workspace: true }))
          .parse(req.body);
        const record = await customersService.create(customers);
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
        const customer = await customersService.read(id);

        if (customer) {
          res.json(customer);
          break;
        }

        res.status(404).end();
        break;
      }

      const customers = await customersService.list();
      res.json(customers);
      break;
    }
    case "PATCH": {
      try {
        const customers = z
          .array(
            customer
              .omit({ workspace: true })
              .partial({ email: true, phone: true, name: true }),
          )
          .parse(req.body);
        const record = await customersService.update(customers);
        res.json(record);
      } catch (error: unknown) {
        console.error(error);
        res.status(400).end();
      }
      break;
    }
    case "DELETE": {
      const ids = z.array(z.string()).parse(req.body);
      await customersService.delete(ids);
      res.status(204).end();
      break;
    }
    default:
      res.status(405).end();
      break;
  }
}
