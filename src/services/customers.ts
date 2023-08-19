import { Customer } from "lib/types";
import { surreal } from "lib/surreal";

export class CustomersService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create(customers: Omit<Customer, "id">[]): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Customer[]>(`
      INSERT INTO customer (email, name, phone) VALUES ${customers
        .map(({ email, name, phone }) => `('${email}', '${name}', ${phone})`)
        .join(",")};
    `);

    // @ts-ignore
    return result[0].result || [];
  }

  async read(id: Customer["id"]): Promise<Customer> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>(id);
    return result[0];
  }

  async list(): Promise<Customer[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Customer>("customer");
    return result;
  }

  async update(
    customers: (Partial<Customer> & { id: Customer["id"] })[],
  ): Promise<void> {
    await surreal.authenticate(this.token);

    const result = await surreal.query(`
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

    return;
  }
}
