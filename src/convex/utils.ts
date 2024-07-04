import {
  GenericMutationCtx,
  GenericQueryCtx,
  TableNamesInDataModel,
  UserIdentity,
} from "convex/server";
import { ConvexError } from "convex/values";
import { v4 as uuid, validate } from "uuid";
import { capitalize } from "lodash";
import { DataModel, Doc, Id, TableNames } from "./_generated/dataModel";

import { event } from "./schema";

/**
 * Extracts the user_id and workspace from the auth object. Throws an error if the user is not authenticated or if the workspace is not found.
 **/
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

type GetEntityByIdInWorkspaceArgs<
  I extends TableNames,
  N extends TableNamesInDataModel<DataModel>,
> = {
  id: Id<I>;
  table: N;
};

/**
 * Tries to get an entity by its id in the current auth workspace. Throws an error if not found.
 */
export async function getEntityByIdInWorkspace<
  I extends TableNames,
  N extends TableNamesInDataModel<DataModel>,
>(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
  { id, table }: GetEntityByIdInWorkspaceArgs<I, N>,
): Promise<Doc<N>> {
  const { workspace } = await getAuthData(ctx);

  const entity = await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .filter((q) => q.eq(q.field("_id"), id))
    .unique();

  if (!entity) {
    throw new ConvexError(`${capitalize(table)} not found in workspace`);
  }

  return entity;
}

/**
 * Gets all entities of the required type in the current auth workspace.
 */
export async function getEntitiesInWorkspace<
  N extends TableNamesInDataModel<DataModel>,
>(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
  table: N,
): Promise<Doc<N>[]> {
  const { workspace } = await getAuthData(ctx);

  return await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .collect();
}

export function getValidUuid(): string {
  const id = uuid();

  if (validate(id)) {
    return id;
  }

  return getValidUuid();
}

export type Event = typeof event.type;

export async function getWorkflowForEvent(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
  event: Event,
) {
  const workflows = await getEntitiesInWorkspace(ctx, "workflows");
  return workflows.find((workflow) => workflow.event === event);
}
