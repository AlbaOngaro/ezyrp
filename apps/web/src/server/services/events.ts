import { ZodError, z } from "zod";

import { GraphQLError } from "graphql";
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
      `INSERT INTO event (start, type, guests) VALUES ${events
        .map(
          ({ start, type, guests }) =>
            `("${start}", "${type}", ${JSON.stringify(guests)})`,
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

    const [{ result }] = await surreal.query<[Event[]]>(
      `SELECT 
        id, 
        start, 
        function() {
          const [type] = await surrealdb.query("SELECT * FROM $type", {
            type: this.type
          }); 
      
          const end = new Date(this.start);
          end.setMinutes(end.getMinutes() + type.duration);

          return end.toISOString();
        } as end, 
        type.name as title, 
        type.variant as variant,
        notes, 
        guests 
      FROM "${id}" FETCH guests, type;`,
    );

    if (!result || !result[0]) {
      throw new GraphQLError("Not found");
    }

    try {
      return event.parse(result[0]);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new GraphQLError("Something is wrong with the data", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            errors: error.issues,
          },
        });
      }

      throw new GraphQLError("Something is wrong with the data", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  async list(): Promise<Event[]> {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Event[]>(
      `SELECT 
        id, 
        start, 
        function() {
          const [type] = await surrealdb.query("SELECT * FROM $type", {
            type: this.type
          }); 
      
          const end = new Date(this.start);
      		end.setMinutes(end.getMinutes() + type.duration);

          return end.toISOString();
        } as end, 
        type.name as title, 
        type.variant as variant,
        notes, 
        guests 
      FROM event FETCH guests, type;`,
    );

    try {
      return z.array(event).parse(result[0].result);
    } catch (error: unknown) {
      console.error(JSON.stringify(error));
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
