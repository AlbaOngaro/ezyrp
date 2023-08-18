import { Customer } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";

const CUSTOMERS: Customer[] = [
  {
    id: "asdf",
    email: "amina.piatti@gmail.com",
    name: "Amina Piatti",
    phone: 41_79_690_79_67,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET": {
      res.json(CUSTOMERS);
      break;
    }
    default:
      res.status(405).end();
      break;
  }
}
