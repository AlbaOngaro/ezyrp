import { GraphQLError } from "graphql";
import { ZodError, z } from "zod";

import { MutationResolvers } from "__generated__/server";

import { createEventInput } from "server/schema/event";
import { EventsService } from "server/services/events";

export const createEvents: MutationResolvers["createEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(createEventInput.omit({ id: true }))
    .parseAsync(args.createEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  return eventsService.create(events);
};

export const updateEvents: MutationResolvers["updateEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(
      createEventInput.partial({
        start: true,
        end: true,
        title: true,
        variant: true,
        guests: true,
      }),
    )
    .parseAsync(args.updateEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  eventsService.update(events);

  return eventsService.list();
};

export const deleteEvents: MutationResolvers["deleteEvents"] = async (
  _,
  args,
  { accessToken },
) => {
  const events = await z
    .array(z.string())
    .parseAsync(args.deleteEventsInput)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const eventsService = new EventsService(accessToken as string);
  return eventsService.delete(events);
};
