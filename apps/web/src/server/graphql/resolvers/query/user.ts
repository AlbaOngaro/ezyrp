import { Surreal } from "surrealdb.js";

import { QueryResolvers, User } from "../../../../__generated__/server";

import { ProfileService } from "../../../services/profile";
import { surreal } from "../../../surreal";

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
