import { GraphQLError } from "graphql";
import { Event, EventType, MutationResolvers } from "__generated__/server";

import { surreal } from "server/surreal";
import { bookEventInput } from "server/schema/booking";

export const bookEvent: MutationResolvers["bookEvent"] = async (_, args) => {
  await surreal.signin({
    NS: "crm",
    DB: "crm",
    user: process.env.SURREAL_USER as string,
    pass: process.env.SURREAL_PASS as string,
  });

  const { type, start, guests } = bookEventInput.parse(args.bookEventInput);

  const [eventType] = await surreal.select<EventType & { workspace: string }>(
    type,
  );

  const [{ result: eventGuests }] = await surreal.query<[{ id: string }]>(`
		${guests
      .map(
        ({ name, email }) => `
					INSERT INTO customer (name, email, workspace) 
					VALUES ("${name}", "${email}", "${eventType.workspace}") 
					ON DUPLICATE KEY UPDATE name = "${name}";
			`,
      )
      .join("\n")}
	`);

  if (!eventGuests || !Array.isArray(eventGuests)) {
    throw new GraphQLError("Intenal server error...");
  }

  const [{ result: event }] = await surreal.query<[{ id: string }[]]>(`
		CREATE event CONTENT ${JSON.stringify({
      guests: eventGuests.map(({ id }) => id),
      type: eventType.id,
      start,
      workspace: eventType.workspace,
    })}
	`);

  if (!event || !Array.isArray(event)) {
    throw new GraphQLError("Not found");
  }

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
		FROM "${event[0].id}" FETCH guests, type;`,
  );

  if (!result || !result[0]) {
    throw new GraphQLError("Not found");
  }

  return result[0];
};
