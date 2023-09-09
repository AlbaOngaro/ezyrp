import { ZodError, z } from "zod";

import { GraphQLError } from "graphql";
import { surreal } from "server/surreal";
import { inputInvoiceFilters, invoice } from "server/schema/invoice";
import { Service } from "server/services/service";
import {
  QueryInvoiceArgs,
  Invoice,
  MutationCreateInvoicesArgs,
  MutationUpdateInvoicesArgs,
  PagedInvoicesResponse,
} from "__generated__/server";

export class InvoicesService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    invoices: MutationCreateInvoicesArgs["createInvoicesArgs"],
  ): Promise<Invoice[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(`
      INSERT INTO invoice (customer, description, status, items, due, emitted) VALUES ${invoices
        .map(
          ({ customer, description, status, items, due, emitted }) =>
            `('${customer}', ${JSON.stringify(
              description,
            )}, '${status}', ${JSON.stringify(items)}, '${due}' ,'${emitted}')`,
        )
        .join(",")};
    `);

    try {
      return z.array(invoice).parse(result[0].result);
    } catch (error: unknown) {
      return [];
    }
  }

  async read(id: QueryInvoiceArgs["id"]): Promise<Invoice> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Invoice[]>(
      `SELECT 
        *, 
        math::sum(items.price) as amount,
        (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
        IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
      FROM ${id}
      FETCH customer, items`,
    );

    try {
      // @ts-ignore
      return invoice.parse(result[0].result[0]);
    } catch (error: unknown) {
      throw new GraphQLError("Something is wrong with the data", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          errors: (error as ZodError).issues,
        },
      });
    }
  }

  async list({
    limit,
    start,
  }: z.infer<typeof inputInvoiceFilters>): Promise<PagedInvoicesResponse> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<[Invoice[], { total: number }[]]>(
      `SELECT 
        *, 
        math::sum(items.price) as amount,
        (SELECT id, name, price, count() as quantity FROM $this.items GROUP BY id, price, name) as items,
        IF type::datetime(due) < time::now() AND status = "pending" THEN "overdue" ELSE status END as status
      FROM invoice
      LIMIT $limit
      START $start
      FETCH customer, items;
      
      SELECT 
        count() AS total
      FROM invoice
      GROUP ALL;
      `,
      {
        limit,
        start,
      },
    );

    try {
      const results = z.array(invoice).parse(result[0].result);
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

    return [];
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
