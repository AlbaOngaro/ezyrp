import { Surreal } from "surrealdb.js";
import { GraphQLError } from "graphql";
import { ZodError } from "zod";
import { QueryResolvers, Subscription, User } from "__generated__/server";
import { surreal } from "server/surreal";
import { subscrption } from "server/schema/subscription";

export const subscription: QueryResolvers["subscription"] = async (
  _,
  __,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);
  const user = (await (surreal as Surreal).info()) as User;

  try {
    const result = await surreal.query<[Subscription[]]>(
      `SELECT * FROM subscription WHERE user = ${user.id}`,
    );

    return subscrption.parse(result?.at(0)?.result?.at(0));
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw new GraphQLError("Something is wrong with the data", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          errors: error.issues,
        },
      });
    }
  }
};
