import { z } from "zod";
import { Service } from "./service";

import { event } from "lib/schema/event";
import { surreal } from "lib/surreal";
import { Customer, Event } from "lib/types";

export class EventsService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(values: Omit<Event, "id" | "workspace">) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `INSERT INTO event ${JSON.stringify(values)}`,
    );

    try {
      return (
        event
          .omit({ workspace: true })
          // @ts-ignore
          .parse(result[0].result[0])
      );
    } catch (error: unknown) {
      return null;
    }
  }

  async read(id: Event["id"]) {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Event>(id);
    return event.omit({ workspace: true }).parse(result[0]);
  }

  async list() {
    await surreal.authenticate(this.token);

    const result = await surreal.select<Event>("event");
    try {
      return z.array(event.omit({ workspace: true })).parse(result);
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
