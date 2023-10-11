import { ZodError, z } from "zod";
import { GraphQLError } from "graphql";
import { EventType, MutationResolvers } from "__generated__/server";
import { surreal } from "server/surreal";

const inputCreateEventTypesArgs = z.array(
  z.object({
    name: z.string(),
    variant: z.string(),
    duration: z.number(),
  }),
);

export const createEventTypes: MutationResolvers["createEventTypes"] = async (
  _,
  args,
  { accessToken },
) => {
  const eventTypes = await inputCreateEventTypesArgs
    .parseAsync(args.createEventTypesInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  await surreal.authenticate(accessToken as string);

  const [{ result }] = await surreal.query<[EventType[]]>(
    `INSERT INTO eventtype (name, variant, duration) VALUES ${eventTypes
      .map(
        ({ name, variant, duration }) =>
          `("${name}", "${variant}", ${duration})`,
      )
      .join(",")};`,
  );

  if (!Array.isArray(result)) {
    console.error(result);
    throw new GraphQLError("Something went wrong...");
  }

  return result;
};

export const deleteEventTypes: MutationResolvers["deleteEventTypes"] = async (
  _,
  args,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);

  await surreal.query(
    `DELETE eventtype WHERE id IN ${JSON.stringify(args.ids)};`,
  );

  return args.ids;
};
