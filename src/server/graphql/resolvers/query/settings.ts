import { GraphQLError } from "graphql";
import { Settings } from "__generated__/graphql";
import { QueryResolvers } from "__generated__/server";
import { surreal } from "server/surreal";

export const settings: QueryResolvers["settings"] = async (
  _,
  __,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);
  const [{ result }] = await surreal.query<[Settings[]]>(
    "SELECT * FROM settings WHERE workspace = $auth.workspace",
  );

  if (!result) {
    throw new GraphQLError("Not found!");
  }

  console.debug(result);

  return result[0];
};
