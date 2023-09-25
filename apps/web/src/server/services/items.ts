import { z } from "zod";
import { InputCreateItems, Item } from "../../__generated__/server";
import { inputItemFilters, item } from "../schema/inventory";
import { surreal } from "../surreal";
import { Service } from "./service";

export class ItemsService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(items: InputCreateItems[]): Promise<Item[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Item[]>(`
      INSERT INTO item (name, description, quantity, price, onetime) VALUES ${items
        .map(
          ({ name, description, quantity, price, onetime = false }) =>
            `('${name}', ${JSON.stringify(
              description,
            )}, ${quantity}, ${price}, ${onetime})`,
        )
        .join(",")};
    `);

    try {
      return z.array(item).parse(result[0].result);
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async list({ limit, start }: z.infer<typeof inputItemFilters>) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<[Item[], { total: number }[]]>(
      `SELECT 
        *
      FROM item
      WHERE onetime != true
      LIMIT $limit
      START $start;
      
      SELECT 
        count() AS total
      FROM item
      WHERE onetime != true
      GROUP ALL;
      `,
      {
        limit,
        start,
      },
    );

    try {
      const results = z.array(item).parse(result[0].result);
      const [{ total }] = z
        .array(
          z.object({
            total: z.number(),
          }),
        )
        .parse(result[1].result);

      return {
        total,
        results,
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        total: 0,
        results: [],
      };
    }
  }
}
