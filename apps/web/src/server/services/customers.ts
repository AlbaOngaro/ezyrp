import { z } from "zod";

import { surreal } from "../surreal";
import {
  customer,
  inputCustomerFilters,
  inputCustomersOrderBy,
} from "../schema/customer";
import {
  Customer,
  MutationCreateCustomersArgs,
  PagedCustomersResponse,
  QueryCustomerArgs,
} from "../../__generated__/server";
import { Service } from "./service";

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

  async list(
    { limit, start, ...rest }: z.infer<typeof inputCustomerFilters>,
    orderBy: z.infer<typeof inputCustomersOrderBy>,
  ): Promise<PagedCustomersResponse> {
    await surreal.authenticate(this.token);

    const filters = Object.entries(rest);
    const orderByArray = Object.entries(orderBy);

    if (filters.length > 0) {
      const result = await surreal.query<[Customer[], { total: number }[]]>(
        `
          SELECT 
            *, 
            (SELECT 
              *, 
              math::sum(items.price) as amount,
              (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
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
          ${
            orderByArray.length > 0
              ? `ORDER BY ${orderByArray.map(
                  ([key, value]) => `${key} ${value}`,
                )}`
              : ""
          }
          LIMIT $limit
          START $start;

          SELECT 
            count() AS total
          FROM customer
          WHERE 
            ${filters
              .map(([key, value]) => `${key} ~ "${value}"`)
              .join("AND \n")}
          GROUP ALL;
        `,
        {
          start,
          limit,
        },
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
          total,
          results,
        };
      } catch (error: unknown) {
        return {
          total: 0,
          results: [],
        };
      }
    }

    const result = await surreal.query<[Customer[], { total: number }[]]>(
      `
      SELECT *, 
      (SELECT 
          *, 
          math::sum(items.price) as amount,
          (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
          IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
        FROM invoice 
        WHERE customer = $parent.id 
        ORDER BY emitted 
        LIMIT 1)[0] as lastInvoice  
      FROM customer
      ${
        orderByArray.length > 0
          ? `ORDER BY ${orderByArray.map(([key, value]) => `${key} ${value}`)}`
          : ""
      }
      LIMIT $limit
      START $start;

      SELECT 
        count() AS total
      FROM customer
      GROUP ALL;
    `,
      {
        start,
        limit,
      },
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
        total,
        results,
      };
    } catch (error: unknown) {
      return {
        total: 0,
        results: [],
      };
    }
  }

  async update(
    customers: (Partial<Customer> & { id: Customer["id"] })[],
  ): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Customer[]>(`
      BEGIN TRANSACTION;

      ${customers
        .map(
          ({ id, ...customer }) =>
            `UPDATE ${id} MERGE ${JSON.stringify(customer)}`,
        )
        .join(";\n")};

      COMMIT TRANSACTION;
    `);

    try {
      return z
        .array(
          customer.partial({
            lastInvoice: true,
          }),
        )
        .parse(result[0].result);
    } catch (error: unknown) {
      console.debug(error);
      return [];
    }
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
