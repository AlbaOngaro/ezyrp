import { GraphQLError } from "graphql";
import { EventType, QueryResolvers } from "__generated__/server";
import { surreal } from "server/surreal";

export const eventType: QueryResolvers["eventType"] = async (
  _,
  args,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);

  const [{ result }] = await surreal.query<[EventType[]]>(
    `SELECT * FROM ${args.id}`,
  );

  if (!result || !result[0]) {
    throw new GraphQLError("Not found");
  }

  return result[0];
};

export const eventTypes: QueryResolvers["eventTypes"] = async (
  _,
  __,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);

  const [{ result }] = await surreal.query<[EventType[]]>(
    `SELECT * FROM eventtype`,
  );

  if (!result) {
    throw new GraphQLError("Not found");
  }

  return result;
};
