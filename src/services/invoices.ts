import { z } from "zod";
import { Invoice } from "lib/types";

import { surreal } from "lib/surreal";
import { invoice } from "lib/schema/invoice";

export class InvoicesService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async create(
    invoices: Omit<Invoice, "id" | "workspace">[],
  ): Promise<Omit<Invoice, "workspace">[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(`
      INSERT INTO invoice (customer, description, status, amount) VALUES ${invoices
        .map(
          ({ customer, description, status, amount }) =>
            `('${customer.id}', '${description}', '${status}', ${amount})`,
        )
        .join(",")};
    `);

    try {
      return z.array(invoice.omit({ workspace: true })).parse(result[0].result);
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async read(id: Invoice["id"]): Promise<Omit<Invoice, "workspace">> {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Invoice>(id);
    return invoice.omit({ workspace: true }).parse(result[0]);
  }

  async list(): Promise<Omit<Invoice, "workspace">[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(
      `SELECT * FROM invoice FETCH customer`,
    );

    try {
      return z.array(invoice.omit({ workspace: true })).parse(result[0].result);
    } catch (error: unknown) {
      console.debug(error);
      return [];
    }
  }

  async update(
    invoices: (Partial<Omit<Invoice, "workspace">> & { id: Invoice["id"] })[],
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
  }
}
