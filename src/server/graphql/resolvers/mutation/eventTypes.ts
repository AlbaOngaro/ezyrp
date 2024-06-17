import { ZodError, z } from "zod";
import { GraphQLError } from "graphql";
import { EventType, MutationResolvers } from "__generated__/server";
import { surreal } from "server/surreal";

const inputCreateEventTypesArgs = z.array(
  z.object({
    name: z.string(),
    variant: z.string(),
    description: z.string().nullable().optional(),
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
    `INSERT INTO eventtype (name, description, variant, duration) VALUES ${eventTypes
      .map(
        ({ name, description, variant, duration }) =>
          `("${name}", "${description}", "${variant}", ${duration})`,
      )
      .join(",")};`,
  );

  if (!Array.isArray(result)) {
    console.error(result);
    throw new GraphQLError("Something went wrong...");
  }

  return result;
};

const inputUpdateEventTypesArgs = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
    variant: z.string().optional(),
    description: z.string().nullable().optional(),
    duration: z.number().optional(),
  }),
);

export const updateEventTypes: MutationResolvers["updateEventTypes"] = async (
  _,
  args,
  { accessToken },
) => {
  const eventTypes = await inputUpdateEventTypesArgs
    .parseAsync(args.updateEventTypesInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });
  await surreal.authenticate(accessToken as string);

  const [{ result }] = await surreal.query<[EventType[]]>(`
    BEGIN TRANSACTION;

    ${eventTypes
      .map(
        ({ id, ...content }) =>
          `UPDATE ${id} MERGE ${JSON.stringify(content)};`,
      )
      .join("\n")}

    COMMIT TRANSACTION;
  `);

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
