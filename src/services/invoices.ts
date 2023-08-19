import { Invoice } from "lib/types";

import { surreal } from "lib/surreal";

export class InvoicesService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create(invoices: Omit<Invoice, "id">[]) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(`
      INSERT INTO invoice (customer, description) VALUES ${invoices
        .map(
          ({ customer, description }) => `('${customer.id}', '${description}')`,
        )
        .join(",")};
    `);

    // @ts-ignore
    return result[0].result || [];
  }

  async read(id: Invoice["id"]): Promise<Invoice> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Invoice>(id);
    return result[0];
  }

  async list(): Promise<Invoice[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(
      `SELECT * FROM invoice FETCH customer`,
    );

    // @ts-ignore
    return result[0].result || [];
  }

  async update(
    invoices: (Partial<Invoice> & { id: Invoice["id"] })[],
  ): Promise<void> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;

      ${invoices
        .map(
          ({ id, ...invoice }) =>
            `UPDATE ${id} MERGE ${JSON.stringify(invoice)}`,
        )
        .join(";\n")};

      COMMIT TRANSACTION;
    `);
  }

  async delete(ids: Invoice["id"][]): Promise<void> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);

    return;
  }
}
