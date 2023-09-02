import { z } from "zod";
import { Invoice } from "lib/types";

import { surreal } from "server/surreal";
import { invoice } from "server/schema/invoice";
import { Service } from "server/services/service";

export class InvoicesService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    invoices: Omit<Invoice, "id" | "workspace">[],
  ): Promise<Omit<Invoice, "workspace">[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(`
      INSERT INTO invoice (customer, description, status, items, due, emitted) VALUES ${invoices
        .map(
          ({ customer, description, status, items, due, emitted }) =>
            `('${customer.id}', '${description}', '${status}', ${JSON.stringify(
              items,
            )}, '${due}' ,'${emitted}')`,
        )
        .join(",")};
    `);

    try {
      return z.array(invoice).parse(result[0].result);
    } catch (error: unknown) {
      return [];
    }
  }

  async read(id: Invoice["id"]): Promise<Omit<Invoice, "workspace">> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(
      `SELECT 
        *, 
        math::sum((SELECT price * quantity as total FROM $this.items).total) as amount,
        IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
      FROM ${id}
      FETCH customer`,
    );
    return invoice.parse(result[0]);
  }

  async list(): Promise<Omit<Invoice, "workspace">[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(
      `SELECT 
        *, 
        math::sum((SELECT price * quantity as total FROM $this.items).total) as amount,
        IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
      FROM invoice
      FETCH customer`,
    );

    try {
      return z.array(invoice).parse(result[0].result);
    } catch (error: unknown) {
      return [];
    }
  }

  async update(
    invoices: (Partial<Omit<Invoice, "workspace" | "amount">> & {
      id: Invoice["id"];
    })[],
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
