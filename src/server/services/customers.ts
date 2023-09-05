import { z } from "zod";

import { surreal } from "server/surreal";
import { customer, inputCustomerFilters } from "server/schema/customer";
import { Service } from "server/services/service";
import {
  Customer,
  MutationCreateCustomersArgs,
  PagedCustomersResponse,
  QueryCustomerArgs,
} from "__generated__/server";

export class CustomersService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    customers: MutationCreateCustomersArgs["createCustomerArgs"],
  ): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Customer[]>(`
      INSERT INTO customer (email, name, phone, photoUrl) VALUES ${customers
        .map(
          ({ email, name, phone, photoUrl = "" }) =>
            `('${email}', '${name}', '${phone}', '${photoUrl}')`,
        )
        .join(",")};
    `);

    try {
      return z.array(customer).parse(result[0].result);
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async read(id: QueryCustomerArgs["id"]): Promise<Customer> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>(id);
    return customer.parse(result[0]);
  }

  async list({
    limit,
    start,
    ...rest
  }: z.infer<typeof inputCustomerFilters>): Promise<PagedCustomersResponse> {
    await surreal.authenticate(this.token);

    const filters = Object.entries(rest);

    if (filters.length > 0) {
      const result = await surreal.query<[Customer[], { total: number }[]]>(
        `
          SELECT 
            *, 
            (SELECT 
              *, 
              math::sum((SELECT price * quantity as total FROM $this.items).total) as amount,
              IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status 
            FROM invoice
            WHERE customer = $parent.id 
            ORDER BY emitted 
            LIMIT 1)[0] as lastInvoice 
          FROM customer
          WHERE 
            ${filters
              .map(([key, value]) => `${key} ~ "${value}"`)
              .join("AND \n")}
          LIMIT ${limit}
          START ${start};

          SELECT 
            count() AS total
          FROM customer
          WHERE 
            ${filters
              .map(([key, value]) => `${key} ~ "${value}"`)
              .join("AND \n")}
          GROUP ALL;
        `,
      );

      try {
        const results = await z.array(customer).parseAsync(result[0].result);
        const [{ total }] = z
          .array(
            z.object({
              total: z.number(),
            }),
          )
          .parse(result[1].result);

        return {
          hasNextPage: total > results.length,
          results,
        };
      } catch (error: unknown) {
        return {
          hasNextPage: false,
          results: [],
        };
      }
    }

    const result = await surreal.query<[Customer[], { total: number }[]]>(`
      SELECT *, 
      (SELECT 
          *, 
          math::sum((SELECT price * quantity as total FROM $this.items).total) as amount,
          IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
        FROM invoice 
        WHERE customer = $parent.id 
        ORDER BY emitted 
        LIMIT 1)[0] as lastInvoice  
      FROM customer
      LIMIT ${limit}
      START ${start};

      SELECT 
        count() AS total
      FROM customer
      GROUP ALL;
    `);

    try {
      const results = await z.array(customer).parseAsync(result[0].result);
      const [{ total }] = z
        .array(
          z.object({
            total: z.number(),
          }),
        )
        .parse(result[1].result);

      return {
        hasNextPage: total > results.length,
        results,
      };
    } catch (error: unknown) {
      return {
        hasNextPage: false,
        results: [],
      };
    }
  }

  async update(
    customers: (Partial<Customer> & { id: Customer["id"] })[],
  ): Promise<void> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;

      ${customers
        .map(
          ({ id, ...customer }) =>
            `UPDATE ${id} MERGE ${JSON.stringify(customer)}`,
        )
        .join(";\n")};

      COMMIT TRANSACTION;
    `);
  }

  async delete(ids: Customer["id"][]): Promise<void> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);
  }
}
