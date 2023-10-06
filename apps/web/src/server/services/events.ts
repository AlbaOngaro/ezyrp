import { z } from "zod";

import { event } from "../schema/event";
import { surreal } from "../surreal";
import {
  Event,
  MutationCreateEventsArgs,
  MutationDeleteEventsArgs,
  MutationUpdateEventsArgs,
} from "../../__generated__/server";
import { Service } from "./service";

export class EventsService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    events: MutationCreateEventsArgs["createEventsInput"],
  ): Promise<Event[]> {
    await surreal.authenticate(this.token);

    await surreal.query<Event[]>(
      `INSERT INTO event (start, end, title, variant, guests) VALUES ${events
        .map(
          ({ start, end, title, variant, guests }) =>
            `("${start}", "${end}", "${title}", "${variant}", ${JSON.stringify(
              guests,
            )})`,
        )
        .join(",")}`,
    );

    try {
      // @ts-ignore
      return this.list();
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async read(id: Event["id"]) {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `SELECT * FROM ${id} FETCH guests`,
    );

    return event.parse(result[0]);
  }

  async list(): Promise<Event[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `SELECT * FROM event FETCH guests`,
    );

    try {
      return z.array(event).parse(result[0].result);
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  async update(events: MutationUpdateEventsArgs["updateEventsInput"]) {
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

  async delete(ids: MutationDeleteEventsArgs["deleteEventsInput"]) {
    await surreal.authenticate(this.token);

    await surreal.query(`
      BEGIN TRANSACTION;
      ${ids.map((id) => `DELETE ${id}`).join(";\n")};
      COMMIT TRANSACTION;
    `);

    return ids;
  }
}
