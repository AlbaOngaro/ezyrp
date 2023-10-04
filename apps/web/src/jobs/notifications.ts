import { client } from "lib/trigger";

export const newCalendarEventTrigger = client.defineDynamicSchedule({
  id: "newCalendarEventTrigger",
});

client.defineJob({
  id: "notifications",
  name: "Event notifications job",
  version: "0.1.1",
  trigger: newCalendarEventTrigger,
  run: async (payload, io, ctx) => {
    await io.logger.info("Ctx", ctx);
    await io.logger.info("Payload", payload);
    // await newCalendarEventTrigger.unregister(ctx.source.id);
  },
});
