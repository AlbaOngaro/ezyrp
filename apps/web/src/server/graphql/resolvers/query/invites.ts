import { Invite, QueryResolvers } from "__generated__/server";

import { surreal } from "server/surreal";

export const invites: QueryResolvers["invites"] = async (
  _,
  __,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);
  const invites = await surreal.select<Invite>("invite");
  return invites;
};
