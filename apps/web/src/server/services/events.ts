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
import { newCalendarEventTrigger } from "jobs";

function dateToCron(date: Date) {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
}

export class EventsService extends Service {
  constructor(token: string) {
    super(token);
  }

  async create(
    events: MutationCreateEventsArgs["createEventsInput"],
  ): Promise<Event[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
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
      const events = z
        .array(
          event.omit({
            guests: true,
          }),
        )
        .parse(result[0].result);

      for (const e of events) {
        const cron = dateToCron(new Date(e.start));
        await newCalendarEventTrigger.register(e.id, {
          type: "cron",
          options: {
            cron,
          },
        });
      }
    } catch (error: unknown) {
      console.error(error);
    }

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
