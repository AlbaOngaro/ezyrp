import { GraphQLError } from "graphql";
import { QueryResolvers, Settings, EventType } from "__generated__/server";

import { surreal } from "server/surreal";

export const booking: QueryResolvers["booking"] = async (_, { id }) => {
  await surreal.signin({
    NS: "crm",
    DB: "crm",
    user: process.env.SURREAL_USER as string,
    pass: process.env.SURREAL_PASS as string,
  });

  const [event] = await surreal.select<EventType & { workspace: string }>(id);

  if (!event) {
    throw new GraphQLError("Not found");
  }

  const [{ result }] = await surreal.query<[Settings[]]>(
    `SELECT * FROM settings WHERE workspace = type::string("${event.workspace}")`,
  );

  if (!result || !result[0]) {
    throw new GraphQLError("Something went wrong...");
  }

  return {
    event,
    settings: result[0],
  };
};
