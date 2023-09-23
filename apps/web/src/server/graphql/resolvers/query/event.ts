import { QueryResolvers } from "../../../../__generated__/server";

import { EventsService } from "../../../services/events";

export const event: QueryResolvers["event"] = async (
  _,
  args,
  { accessToken },
) => {
  const eventsService = new EventsService(accessToken as string);
  return eventsService.read(args.id);
};

export const events: QueryResolvers["events"] = async (
  _,
  __,
  { accessToken },
) => {
  const eventsService = new EventsService(accessToken as string);
  return eventsService.list();
};
