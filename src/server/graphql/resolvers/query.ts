import { Surreal } from "surrealdb.js";
import { surreal } from "server/surreal";
import { QueryResolvers, User } from "__generated__/server";

export const user: QueryResolvers["user"] = async (_, __, { accessToken }) => {
  await surreal.authenticate(accessToken as string);
  const record = await (surreal as Surreal).info();
  return record as User;
};
