import { ZodError, z } from "zod";
import { GraphQLError } from "graphql";
import { InputCreateItems, Item } from "../../__generated__/server";
import { inputItemFilters, item } from "../schema/inventory";
import { surreal } from "../surreal";
import { Service } from "./service";
import { InputUpdateItems } from "__generated__/graphql";

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

  async read(id: string): Promise<Item> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<[Item[]]>(`
      SELECT * FROM ${id}
    `);

    try {
      return item.parse(result?.at(0)?.result?.at(0));
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new GraphQLError("Something is wrong with the data", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            errors: error.issues,
          },
        });
      } else {
        throw new GraphQLError("Internal server error", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    }
  }

  async update(items: InputUpdateItems[]): Promise<Item[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Item[]>(`
      BEGIN TRANSACTION;

      ${items
        .map(({ id, ...item }) => `UPDATE ${id} MERGE ${JSON.stringify(item)}`)
        .join(";\n")};

      COMMIT TRANSACTION;
    `);

    try {
      return z.array(item).parse(result[0].result);
    } catch (error: unknown) {
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

  async delete(ids: string[]): Promise<string[]> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);

    return ids;
  }
}
