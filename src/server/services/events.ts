import { z } from "zod";
import { Service } from "./service";

import { event } from "server/schema/event";
import { surreal } from "server/surreal";
import { CreateEventInput, Customer, Event } from "lib/types";

export class EventsService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(values: Omit<CreateEventInput, "id">) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `INSERT INTO event ${JSON.stringify(values)}`,
    );

    try {
      // @ts-ignore
      return this.read(result[0].result[0].id);
    } catch (error: unknown) {
      return null;
    }
  }

  async read(id: Event["id"]) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `SELECT * FROM ${id} FETCH guests`,
    );

    return event.parse(result[0]);
  }

  async list() {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `SELECT * FROM event FETCH guests`,
    );

    try {
      return z.array(event).parse(result[0].result);
    } catch (error: unknown) {
      return [];
    }
  }

  async update(events: Partial<Event> & { id: Event["id"] }[]) {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;

      ${events
        .map(
          ({ id, ...event }) => `UPDATE ${id} MERGE ${JSON.stringify(event)}`,
        )
        .join(";\n")};

      COMMIT TRANSACTION;
    `);
  }

  async delete(ids: Customer["id"][]) {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);
  }
}
