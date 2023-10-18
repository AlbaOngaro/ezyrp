import { GraphQLError } from "graphql";
import { QueryResolvers, Booking } from "__generated__/server";

import { surreal } from "server/surreal";

function getFirstAvailableDay(schedule: number[]) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  let day = date.getDay() === 0 ? 6 : date.getDay() - 1;

  while (!schedule.includes(day)) {
    date.setDate(date.getDate() + 1);
    day = date.getDay() === 0 ? 6 : date.getDay() - 1;
  }

  return date.toISOString();
}

export const booking: QueryResolvers["booking"] = async (_, args) => {
  await surreal.signin({
    NS: "crm",
    DB: "crm",
    user: process.env.SURREAL_USER as string,
    pass: process.env.SURREAL_PASS as string,
  });

  const [{ result: days }] = await surreal.query<[{ days: number[] }[]]>(
    `SELECT days FROM settings WHERE workspace = ${args.id}.workspace`,
  );

  if (!days || !Array.isArray(days)) {
    throw new GraphQLError("Internal server error...");
  }

  const day = args.day || getFirstAvailableDay(days[0].days);
  const id = args.id;

  console.debug("day", day);

  const [{ result }] = await surreal.query<[Booking[]]>(
    '\
    SELECT \
      id,\
      name,\
      duration,\
      description,\
      $day as day,\
      (SELECT VALUE\
        function() {\
          const $parent = await surrealdb.value("$parent");\
          const events = await surrealdb.query("SELECT time::format(start, \'%H:%M\') as time FROM event WHERE time::yday($day) = time::yday(start)");\
          return Array.from({ length: (this.end - this.start) * (60 / $parent.duration)}, (_, i) => {\
              const date = new Date();\
              date.setHours(this.start, $parent.duration * i);\
              const hours = date.getHours().toString().padStart(2, "0");\
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
