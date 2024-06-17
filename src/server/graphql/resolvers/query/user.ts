import { Surreal } from "surrealdb.js";

import { surreal } from "server/surreal";
import { ProfileService } from "server/services/profile";
import { QueryResolvers, User } from "__generated__/server";
import { TeamUser } from "__generated__/graphql";

export const user: QueryResolvers["user"] = async (_, __, { accessToken }) => {
  await surreal.authenticate(accessToken as string);
  const user = await (surreal as Surreal).info();
  const profileService = new ProfileService(accessToken as string);
  const profile = await profileService.read();

  return {
    ...(user as Omit<User, "profile">),
    profile,
  };
};

export const users: QueryResolvers["users"] = async (
  _,
  __,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);
  const [{ result }] = await surreal.query<[TeamUser[]]>(
    `SELECT *, (SELECT VALUE photoUrl FROM profile WHERE user = $parent.id)[0] as photoUrl FROM user;`,
  );
  return result || [];
};
