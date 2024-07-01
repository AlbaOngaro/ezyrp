import {
  GenericMutationCtx,
  GenericQueryCtx,
  UserIdentity,
} from "convex/server";
import { ConvexError } from "convex/values";
import { v4 as uuid, validate } from "uuid";

export async function getAuthData(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
) {
  const identity = (await ctx.auth.getUserIdentity()) as UserIdentity & {
    websiteUrl?: string;
  };
  if (!identity) {
    throw new ConvexError(
      "Unautneticated, please login to access this resource",
    );
  }

  if (!identity.websiteUrl) {
    throw new ConvexError("Cannot get workspace from user identity; Aborting.");
  }

  console.log({
    user_id: identity.tokenIdentifier,
    workspace: identity.websiteUrl,
  });

  return {
    user_id: identity.tokenIdentifier,
    workspace: identity.websiteUrl,
  };
}

export function getValidUuid(): string {
  const id = uuid();

  if (validate(id)) {
    return id;
  }

  return getValidUuid();
}
