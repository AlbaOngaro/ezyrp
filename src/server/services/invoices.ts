import { z } from "zod";

import { surreal } from "server/surreal";
import { invoice } from "server/schema/invoice";
import { Service } from "server/services/service";
import {
  QueryInvoiceArgs,
  Invoice,
  MutationCreateInvoicesArgs,
  MutationUpdateInvoicesArgs,
} from "__generated__/server";

export class InvoicesService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    invoices: MutationCreateInvoicesArgs["createInvoicesArgs"],
  ): Promise<Invoice[]> {
    await surreal.authenticate(this.token);

    await surreal.query<Invoice[]>(`
      INSERT INTO invoice (customer, description, status, items, due, emitted) VALUES ${invoices
        .map(
          ({ customer, description, status, items, due, emitted }) =>
            `('${customer}', '${description}', '${status}', ${JSON.stringify(
              items,
            )}, '${due}' ,'${emitted}')`,
        )
        .join(",")};
    `);

    try {
      return this.list();
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async read(id: QueryInvoiceArgs["id"]): Promise<Invoice> {
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

  async list(): Promise<Invoice[]> {
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
      console.error(error);
      return [];
    }
  }

  async update(
    invoices: MutationUpdateInvoicesArgs["updateInvoicesArgs"],
  ): Promise<Invoice[]> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;

      ${invoices
        .map(
          ({ id, ...invoice }) =>
            `UPDATE ${id} MERGE ${JSON.stringify({
              ...invoice,
              updated_at: new Date().toISOString(),
            })}`,
        )
        .join(";\n")};

      COMMIT TRANSACTION;
    `);

    return this.list();
  }

  async delete(ids: Invoice["id"][]): Promise<Invoice["id"][]> {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);

    return ids;
  }
}
