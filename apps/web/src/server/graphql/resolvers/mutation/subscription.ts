import { Surreal } from "surrealdb.js";

import { ZodError } from "zod";
import { GraphQLError } from "graphql";
import { MutationResolvers, User } from "__generated__/server";

import { surreal } from "server/surreal";
import { Subscription } from "__generated__/graphql";
import { subscrption } from "server/schema/subscription";

export const createSubscription: MutationResolvers["createSubscription"] =
  async (_, args, { accessToken }) => {
    await surreal.authenticate(accessToken as string);
    const user = (await (surreal as Surreal).info()) as User;

    const result = await surreal.query<[Subscription[]]>(
      `
				IF (SELECT * FROM subscription WHERE user = $auth.id) THEN (
					UPDATE subscription MERGE ${JSON.stringify(
            args.subscriptionInput,
          )} WHERE user = $auth.id
				) ELSE (
					CREATE subscription CONTENT ${JSON.stringify({
            ...args.subscriptionInput,
            user: user.id,
          })}
				) END;
			
			`,
    );

    try {
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
