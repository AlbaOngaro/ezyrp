import { GraphQLError } from "graphql";
import { QueryResolvers, Booking } from "__generated__/server";

import { surreal } from "server/surreal";

export const booking: QueryResolvers["booking"] = async (_, { id, day }) => {
  await surreal.signin({
    NS: "crm",
    DB: "crm",
    user: process.env.SURREAL_USER as string,
    pass: process.env.SURREAL_PASS as string,
  });

  const [{ result }] = await surreal.query<[Booking[]]>(
    '\
    SELECT \
      id,\
      name,\
      duration,\
      description,\
      (SELECT VALUE\
        function() {\
          const $parent = await surrealdb.value("$parent");\
          const events = await surrealdb.query("SELECT time::format(start, \'%H:%M\') as time FROM event WHERE time::yday($day) = time::yday(start)");\
          return Array.from({ length: (this.end - this.start) * (60 / $parent.duration)}, (_, i) => {\
              const date = new Date();\
              date.setHours(this.start, $parent.duration * i);\
              const hours = date.getHours();\
              const minutes = date.getMinutes().toString().padStart(2, "0");\
              return `${hours}:${minutes}`;\
            })\
            .filter((slot) => !events.some(({ time }) => time === slot))\
        } as slots \
      FROM settings \
      WHERE workspace = $parent.workspace)[0] as slots,\
      (SELECT VALUE days FROM settings WHERE workspace = $parent.workspace)[0] as days\
      FROM $id;\
    ',
    {
      id,
      day,
    },
  );

  if (!result || !result[0]) {
    throw new GraphQLError("Something went wrong...");
  }

  return result[0];
};
