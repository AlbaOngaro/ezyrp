import { ZodError } from "zod";
import { GraphQLError } from "graphql";
import { MutationResolvers } from "__generated__/server";
import { surreal } from "server/surreal";
import { Settings } from "__generated__/graphql";

import { inputUpdateSettings } from "server/schema/settings";

export const updateSettings: MutationResolvers["updateSettings"] = async (
  _,
  args,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);

  const settings = await inputUpdateSettings
    .parseAsync(args.updateSettingsInput)
    .catch((errors) => {
      if (errors instanceof ZodError) {
        throw new GraphQLError("Invalid argument value", {
          extensions: {
            code: "BAD_USER_INPUT",
            errors: errors.issues,
          },
        });
      }
    });

  const [{ result }] = await surreal.query<[Settings[]]>(
    `UPDATE settings MERGE ${JSON.stringify(
      settings,
    )} WHERE workspace = $auth.workspace;`,
  );

  console.debug(result);

  if (!result) {
    throw new GraphQLError("Something went wrong!");
  }

  return result[0];
};
