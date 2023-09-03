import { z } from "zod";

import { surreal } from "server/surreal";
import { customer } from "server/schema/customer";
import { Service } from "server/services/service";
import {
  Customer,
  MutationCreateCustomersArgs,
  QueryCustomerArgs,
  QueryCustomersArgs,
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
      INSERT INTO customer (email, name, phone) VALUES ${customers
        .map(({ email, name, phone }) => `('${email}', '${name}', '${phone}')`)
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

  async list(filters?: QueryCustomersArgs["filters"]): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    if (filters) {
      const tmp = Object.entries(filters);
      const result = await surreal.query<Customer[]>(
        tmp.length === 0
          ? `SELECT * FROM customer`
          : `
            SELECT * FROM customer
            WHERE 
              ${tmp.map(([key, value]) => `${key} ~ "${value}"`).join("AND \n")}
        `,
      );

      try {
        return z.array(customer).parse(result[0].result);
      } catch (error: unknown) {
        return [];
      }
    }

    const result = await surreal.query<Customer[]>(`SELECT * FROM customer`);

    try {
      return z.array(customer).parse(result[0].result);
    } catch (error: unknown) {
      return [];
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
