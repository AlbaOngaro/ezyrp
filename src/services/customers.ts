import { z } from "zod";
import { Customer } from "lib/types";
import { surreal } from "lib/surreal";
import { customer } from "lib/schema/customer";
import { Service } from "services/service";

export class CustomersService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    customers: Omit<Customer, "id" | "workspace">[],
  ): Promise<Omit<Customer, "workspace">[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Customer[]>(`
      INSERT INTO customer (email, name, phone) VALUES ${customers
        .map(({ email, name, phone }) => `('${email}', '${name}', '${phone}')`)
        .join(",")};
    `);

    try {
      return z
        .array(customer.omit({ workspace: true }))
        .parse(result[0].result);
    } catch (error: unknown) {
      return [];
    }
  }

  async read(id: Customer["id"]): Promise<Omit<Customer, "workspace">> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>(id);
    return customer.omit({ workspace: true }).parse(result[0]);
  }

  async list(
    filters: Partial<Omit<Customer, "workspace" | "id">>,
  ): Promise<Omit<Customer, "workspace">[]> {
    await surreal.authenticate(this.token);

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
      return z
        .array(customer.omit({ workspace: true }))
        .parse(result[0].result);
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
